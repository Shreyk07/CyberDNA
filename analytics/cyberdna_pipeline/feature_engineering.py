"""
Feature Engineering for Employee Behavioral Fingerprinting & Insider Threat Detection
"""
from typing import Dict, Any, List
import pandas as pd
import numpy as np
from scipy.stats import entropy

class FeatureEngineer:
    """Extracts multivariate behavioral feature vectors per employee/entity."""

    @staticmethod
    def calculate_hourly_entropy(hours_series: pd.Series) -> float:
        """Shannon entropy of activity across 24 hours of the day (0 to log2(24)=4.58)."""
        counts = hours_series.value_counts(normalize=True)
        if len(counts) <= 1:
            return 0.0
        return float(entropy(counts, base=2))

    @classmethod
    def extract_entity_features(cls, entity_events: pd.DataFrame) -> Dict[str, float]:
        """
        Calculates multidimensional insider threat features for an employee's event slice.
        """
        n_events = len(entity_events)
        if n_events == 0:
            return {}

        # 1. Temporal & Diurnal Rhythm
        off_hours_ratio = float(entity_events["is_off_hours"].mean()) if "is_off_hours" in entity_events.columns else 0.0
        weekend_ratio = float(entity_events["is_weekend"].mean()) if "is_weekend" in entity_events.columns else 0.0
        hour_entropy = cls.calculate_hourly_entropy(entity_events["hour_of_day"]) if "hour_of_day" in entity_events.columns else 0.0

        min_time = entity_events["timestamp"].min()
        max_time = entity_events["timestamp"].max()
        time_span_hours = max((max_time - min_time).total_seconds() / 3600.0, 1.0)
        events_per_hour = float(n_events / time_span_hours)

        # 2. File & Removable Media Activity
        file_events = entity_events[entity_events["event_type"].str.contains("FILE", na=False)]
        file_count = float(len(file_events))

        usb_events = entity_events[
            entity_events["event_type"].str.contains("REMOVABLE|USB", na=False) |
            entity_events["protocol"].str.contains("USB", na=False)
        ]
        usb_count = float(len(usb_events))

        usb_bytes = float(usb_events["bytes_transferred"].sum() / (1024 * 1024)) if len(usb_events) > 0 else 0.0

        # Cloud storage uploads
        cloud_events = entity_events[entity_events["event_type"].str.contains("CLOUD_UPLOAD|EXFIL", na=False)]
        cloud_mbytes = float(cloud_events["bytes_transferred"].sum() / (1024 * 1024)) if len(cloud_events) > 0 else 0.0

        # 3. Network & Destination Diversity
        dest_ip_col = "destination_ip" if "destination_ip" in entity_events.columns else None
        dest_ips_count = float(entity_events[dest_ip_col].nunique()) if dest_ip_col else 1.0
        dest_ip_diversity = float(dest_ips_count / max(n_events, 1))

        # 4. Authentication & Failure Statistics
        auth_events = entity_events[entity_events["event_type"].str.contains("AUTH|LOGON", na=False)]
        auth_count = len(auth_events)
        auth_failures = len(entity_events[entity_events["event_type"].str.contains("FAIL|REJECT", na=False)])
        auth_failure_ratio = float(auth_failures / max(auth_count, 1)) if auth_count > 0 else 0.0

        # 5. Data Transfer Volume
        bytes_col = entity_events["bytes_transferred"] if "bytes_transferred" in entity_events.columns else pd.Series([0])
        mean_bytes = float(bytes_col.mean())
        max_bytes = float(bytes_col.max())
        std_bytes = float(bytes_col.std(ddof=0)) if len(bytes_col) > 1 else 0.0
        total_mbytes = float(bytes_col.sum() / (1024 * 1024))

        # 6. Process execution diversity
        proc_col = "process_name" if "process_name" in entity_events.columns else None
        proc_count = float(entity_events[proc_col].nunique()) if proc_col else 1.0

        return {
            "event_count": float(n_events),
            "events_per_hour": round(events_per_hour, 2),
            "off_hours_ratio": round(off_hours_ratio, 4),
            "weekend_ratio": round(weekend_ratio, 4),
            "hourly_entropy": round(hour_entropy, 3),
            "file_events_count": file_count,
            "usb_transfer_count": usb_count,
            "usb_transfer_mbytes": round(usb_bytes, 2),
            "cloud_upload_mbytes": round(cloud_mbytes, 2),
            "unique_destinations": float(dest_ips_count),
            "destination_diversity": round(dest_ip_diversity, 4),
            "auth_failure_ratio": round(auth_failure_ratio, 4),
            "auth_failure_count": float(auth_failures),
            "mean_bytes_transferred": round(mean_bytes, 1),
            "max_bytes_transferred": round(max_bytes, 1),
            "std_bytes_transferred": round(std_bytes, 1),
            "total_mbytes_transferred": round(total_mbytes, 3),
            "unique_processes": float(proc_count)
        }

    @classmethod
    def build_feature_matrix(cls, df: pd.DataFrame) -> pd.DataFrame:
        """Groups dataset by entity_id and builds a unified feature matrix."""
        entities = df["entity_id"].unique()
        records = []
        for entity_id in entities:
            sub = df[df["entity_id"] == entity_id]
            entity_type = sub["entity_type"].iloc[0] if "entity_type" in sub.columns else "EMPLOYEE"
            feats = cls.extract_entity_features(sub)
            feats["entity_id"] = entity_id
            feats["entity_type"] = entity_type
            records.append(feats)

        feature_df = pd.DataFrame(records)
        return feature_df.set_index("entity_id")
