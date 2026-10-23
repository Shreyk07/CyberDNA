"""
Multivariate Anomaly Detection using Isolation Forest & Statistical Baselines
"""
from typing import Dict, Any, List, Tuple
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
try:
    from .feature_engineering import FeatureEngineer
except (ImportError, ValueError):
    from feature_engineering import FeatureEngineer

class AnomalyDetector:
    """
    Dual-layer anomaly detector:
    1. Statistical Feature-Level Deviation Engine
    2. Unsupervised Isolation Forest Multi-dimensional Contamination Model
    """

    def __init__(self, contamination: float = 0.10, random_state: int = 42):
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            contamination=self.contamination,
            random_state=self.random_state,
            n_estimators=100
        )
        self.feature_cols: List[str] = []
        self.is_fitted = False

    def fit_baseline_matrix(self, feature_df: pd.DataFrame) -> "AnomalyDetector":
        """Fits Isolation Forest on reference baseline feature matrix."""
        # Select numeric columns
        numeric_df = feature_df.select_dtypes(include=[np.number]).fillna(0)
        # Exclude metadata like count
        cols_to_use = [c for c in numeric_df.columns if c not in ["event_count"]]
        if len(cols_to_use) == 0:
            return self

        self.feature_cols = cols_to_use
        X = numeric_df[self.feature_cols].values
        self.model.fit(X)
        self.is_fitted = True
        return self

    def score_entities(self, feature_df: pd.DataFrame) -> pd.DataFrame:
        """
        Calculates raw Isolation Forest score, calibrated Risk Score (0-100),
        and flags statistical anomalies.
        """
        results_df = feature_df.copy()

        if not self.is_fitted:
            results_df["raw_anomaly_score"] = 0.0
            results_df["model_risk_score"] = 0.0
            results_df["is_isolation_anomaly"] = False
            return results_df

        numeric_df = feature_df.select_dtypes(include=[np.number]).fillna(0)
        for col in self.feature_cols:
            if col not in numeric_df.columns:
                numeric_df[col] = 0.0

        X = numeric_df[self.feature_cols].values

        # Isolation Forest decision_function: lower means more anomalous (negative = outlier)
        raw_scores = self.model.decision_function(X)
        predictions = self.model.predict(X) # -1: anomaly, 1: normal

        results_df["raw_anomaly_score"] = raw_scores

        # Calibrate raw score into 0-100 risk score
        # raw_scores typically range from -0.3 (extreme anomaly) to +0.25 (highly normal)
        min_expected = -0.30
        max_expected = 0.25
        normalized = 1.0 - np.clip((raw_scores - min_expected) / (max_expected - min_expected), 0.0, 1.0)
        calibrated_risk = np.round(normalized * 100.0, 1)

        results_df["model_risk_score"] = calibrated_risk
        results_df["is_isolation_anomaly"] = (predictions == -1)

        return results_df
