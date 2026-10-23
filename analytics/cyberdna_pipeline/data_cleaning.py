"""
Data Cleaning & Normalization for CyberDNA Analytics
"""
import pandas as pd
import numpy as np

class DataCleaner:
    """Preprocesses raw security logs into clean normalized tabular records."""

    @staticmethod
    def clean(df: pd.DataFrame) -> pd.DataFrame:
        clean_df = df.copy()

        # Parse and sort timestamp
        clean_df["timestamp"] = pd.to_datetime(clean_df["timestamp"], utc=True)
        clean_df = clean_df.sort_values("timestamp").reset_index(drop=True)

        # Standardize strings
        clean_df["entity_id"] = clean_df["entity_id"].astype(str).str.strip()
        clean_df["entity_type"] = clean_df["entity_type"].astype(str).str.upper().str.strip()
        clean_df["event_type"] = clean_df["event_type"].astype(str).str.upper().str.strip()
        clean_df["severity"] = clean_df["severity"].astype(str).str.upper().str.strip()

        # Default severities if unknown
        valid_sevs = {"INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"}
        clean_df["severity"] = clean_df["severity"].apply(lambda s: s if s in valid_sevs else "INFO")

        # Impute numerical features
        if "bytes_transferred" not in clean_df.columns:
            clean_df["bytes_transferred"] = 0
        else:
            clean_df["bytes_transferred"] = pd.to_numeric(clean_df["bytes_transferred"], errors="coerce").fillna(0)

        if "destination_port" in clean_df.columns:
            clean_df["destination_port"] = pd.to_numeric(clean_df["destination_port"], errors="coerce").fillna(0).astype(int)

        # Extract temporal features
        clean_df["hour_of_day"] = clean_df["timestamp"].dt.hour
        clean_df["day_of_week"] = clean_df["timestamp"].dt.dayofweek
        clean_df["is_weekend"] = clean_df["day_of_week"].isin([5, 6]).astype(int)
        clean_df["is_off_hours"] = ((clean_df["hour_of_day"] < 7) | (clean_df["hour_of_day"] > 19)).astype(int)

        return clean_df
