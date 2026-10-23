"""
Schema Validation Module for CyberDNA Ingestion Pipeline
"""
import re
from typing import Dict, Any, List, Tuple
import pandas as pd

REQUIRED_COLUMNS = [
    "timestamp",
    "event_id",
    "event_type",
    "entity_id",
    "entity_type",
    "severity"
]

OPTIONAL_COLUMNS = [
    "source_ip",
    "destination_ip",
    "destination_port",
    "protocol",
    "bytes_transferred",
    "process_name",
    "user_agent",
    "status_code",
    "rule_triggered",
    "is_synthetic"
]

ALLOWED_ENTITY_TYPES = {"USER", "DEVICE", "IP", "SERVER", "DOMAIN"}
ALLOWED_SEVERITIES = {"INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"}

class SchemaValidator:
    """Validates incoming tabular security event logs."""

    @staticmethod
    def validate_dataframe(df: pd.DataFrame) -> Tuple[bool, Dict[str, Any]]:
        """
        Validates columns, null constraints, and value enumerations.
        Returns (is_valid, validation_report).
        """
        missing_cols = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        if missing_cols:
            return False, {
                "valid": False,
                "error": f"Missing required columns: {', '.join(missing_cols)}",
                "missing_columns": missing_cols,
                "row_count": len(df)
            }

        # Check timestamp parsing
        try:
            pd.to_datetime(df["timestamp"])
            timestamp_valid = True
        except Exception as e:
            return False, {
                "valid": False,
                "error": f"Invalid timestamp format detected: {str(e)}",
                "row_count": len(df)
            }

        # Entity type validation
        invalid_entities = set(df["entity_type"].dropna().unique()) - ALLOWED_ENTITY_TYPES
        # Severity validation
        invalid_severities = set(df["severity"].dropna().unique()) - ALLOWED_SEVERITIES

        null_counts = df[REQUIRED_COLUMNS].isnull().sum().to_dict()

        report = {
            "valid": True,
            "row_count": len(df),
            "columns_present": list(df.columns),
            "entity_types_found": list(df["entity_type"].dropna().unique()),
            "severities_found": list(df["severity"].dropna().unique()),
            "null_counts": null_counts,
            "has_warnings": bool(invalid_entities or invalid_severities),
            "warnings": []
        }

        if invalid_entities:
            report["warnings"].append(f"Non-standard entity types: {list(invalid_entities)}")
        if invalid_severities:
            report["warnings"].append(f"Non-standard severities: {list(invalid_severities)}")

        return True, report
