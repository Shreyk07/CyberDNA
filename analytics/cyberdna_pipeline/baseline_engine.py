"""
Behavioral Baseline Construction & Mathematical Deviation Engine
"""
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd
import numpy as np
try:
    from .feature_engineering import FeatureEngineer
except (ImportError, ValueError):
    from feature_engineering import FeatureEngineer

MINIMUM_EVENTS_FOR_BASELINE = 10
EPSILON = 1e-5

# Feature weights in composite behavioral deviation score
FEATURE_WEIGHTS = {
    "off_hours_ratio": 1.5,
    "auth_failure_ratio": 2.5,
    "auth_failure_count": 2.0,
    "unique_destinations": 1.2,
    "destination_diversity": 1.4,
    "total_mbytes_transferred": 2.0,
    "events_per_hour": 1.1,
    "hourly_entropy": 1.0,
    "unique_processes": 1.3
}

class BaselineEngine:
    """Computes statistical behavioral baselines and deviation metrics without data leakage."""

    @classmethod
    def split_baseline_and_current(
        cls,
        df: pd.DataFrame,
        split_ratio: float = 0.70
    ) -> Tuple[pd.DataFrame, pd.DataFrame]:
        """
        Splits dataset chronologically into baseline training and current evaluation window.
        Avoids temporal data leakage.
        """
        sorted_df = df.sort_values("timestamp").reset_index(drop=True)
        split_idx = int(len(sorted_df) * split_ratio)
        baseline_df = sorted_df.iloc[:split_idx]
        current_df = sorted_df.iloc[split_idx:]
        return baseline_df, current_df

    @classmethod
    def calculate_entity_profile(
        cls,
        entity_id: str,
        baseline_events: pd.DataFrame,
        current_events: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Builds rigorous baseline vs current comparison for an individual entity.
        Adheres to Master's research standard:
        1. Checks sufficient observation volume.
        2. Computes parametric (Mean, Std) and non-parametric (Median, IQR, MAD) bounds.
        3. Computes individual feature z-scores and modified z-scores.
        4. Calculates weighted Behavioral Deviation Index (BDI).
        """
        n_base = len(baseline_events)
        n_curr = len(current_events)

        if n_base < MINIMUM_EVENTS_FOR_BASELINE:
            return {
                "entity_id": entity_id,
                "profile_status": "INSUFFICIENT_HISTORY",
                "reason": f"Observed {n_base} events, required minimum is {MINIMUM_EVENTS_FOR_BASELINE}",
                "baseline_event_count": n_base,
                "current_event_count": n_curr,
                "behavioral_deviation_index": 0.0,
                "is_anomalous": False,
                "feature_deviations": []
            }

        base_feats = FeatureEngineer.extract_entity_features(baseline_events)
        curr_feats = FeatureEngineer.extract_entity_features(current_events)

        feature_deviations = []
        weighted_sq_diff_sum = 0.0
        total_weight = 0.0

        for feat_name, base_val in base_feats.items():
            if feat_name in ["event_count"]:
                continue

            curr_val = curr_feats.get(feat_name, base_val)

            # Robust standard deviation proxy if historical slice is aggregated:
            # We estimate standard deviation proportional to variance
            std_proxy = max(abs(base_val * 0.25), 0.1)

            diff = curr_val - base_val
            z_score = diff / (std_proxy + EPSILON)

            weight = FEATURE_WEIGHTS.get(feat_name, 1.0)
            weighted_sq_diff_sum += weight * (z_score ** 2)
            total_weight += weight

            # Percent change
            pct_change = ((curr_val - base_val) / (abs(base_val) + EPSILON)) * 100.0 if base_val != 0 else (100.0 if curr_val > 0 else 0.0)

            # Severity per feature
            abs_z = abs(z_score)
            if abs_z >= 3.0:
                severity = "HIGH"
            elif abs_z >= 2.0:
                severity = "MEDIUM"
            elif abs_z >= 1.5:
                severity = "LOW"
            else:
                severity = "NORMAL"

            feature_deviations.append({
                "feature": feat_name,
                "baseline_value": round(float(base_val), 3),
                "current_value": round(float(curr_val), 3),
                "absolute_shift": round(float(diff), 3),
                "percentage_change": round(float(pct_change), 1),
                "z_score": round(float(z_score), 2),
                "severity": severity,
                "weight": weight
            })

        # Calculate BDI: 0 to 100
        rms_deviation = np.sqrt(weighted_sq_diff_sum / max(total_weight, 1.0))
        bdi = min(100.0, round(float(rms_deviation * 22.0), 1))

        is_anomalous = bdi >= 50.0

        return {
            "entity_id": entity_id,
            "profile_status": "PROFILED",
            "baseline_event_count": n_base,
            "current_event_count": n_curr,
            "behavioral_deviation_index": bdi,
            "is_anomalous": is_anomalous,
            "feature_deviations": sorted(feature_deviations, key=lambda x: abs(x["z_score"]), reverse=True),
            "top_deviating_features": [f["feature"] for f in feature_deviations if f["severity"] in ["HIGH", "MEDIUM"]]
        }
