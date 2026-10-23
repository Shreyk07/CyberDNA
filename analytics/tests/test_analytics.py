"""
Unit Tests for CyberDNA Big Data Analytics Pipeline
Validates scientific behavioral baseline calculations, insufficient history safeguards,
Isolation Forest scoring, and MITRE attack-chain correlation.
"""
import unittest
import pandas as pd
import numpy as np
from datetime import datetime, timezone, timedelta

from analytics.cyberdna_pipeline.schema_validation import SchemaValidator
from analytics.cyberdna_pipeline.data_cleaning import DataCleaner
from analytics.cyberdna_pipeline.feature_engineering import FeatureEngineer
from analytics.cyberdna_pipeline.baseline_engine import BaselineEngine
from analytics.cyberdna_pipeline.anomaly_detector import AnomalyDetector
from analytics.cyberdna_pipeline.correlation_engine import CorrelationEngine

class TestCyberDNAPipeline(unittest.TestCase):

    def setUp(self):
        self.sample_raw_data = pd.DataFrame([
            {
                "timestamp": (datetime(2026, 10, 1, 10, 0, tzinfo=timezone.utc) + timedelta(hours=i)).isoformat(),
                "event_id": f"EVT-{i:03d}",
                "event_type": "AUTH_SUCCESS" if i % 4 != 0 else "AUTH_FAILURE",
                "entity_id": "user:test.analyst",
                "entity_type": "USER",
                "severity": "INFO",
                "source_ip": "10.0.1.50",
                "destination_ip": "10.0.2.100",
                "destination_port": 443,
                "protocol": "TCP",
                "bytes_transferred": 1500 * (i + 1),
                "process_name": "browser.exe"
            }
            for i in range(25)
        ])

    def test_schema_validation_success(self):
        is_valid, report = SchemaValidator.validate_dataframe(self.sample_raw_data)
        self.assertTrue(is_valid)
        self.assertEqual(report["row_count"], 25)

    def test_schema_validation_missing_col(self):
        invalid_df = self.sample_raw_data.drop(columns=["event_type"])
        is_valid, report = SchemaValidator.validate_dataframe(invalid_df)
        self.assertFalse(is_valid)
        self.assertIn("Missing required columns", report["error"])

    def test_data_cleaning_features(self):
        cleaned = DataCleaner.clean(self.sample_raw_data)
        self.assertIn("hour_of_day", cleaned.columns)
        self.assertIn("is_off_hours", cleaned.columns)
        self.assertEqual(cleaned["entity_id"].iloc[0], "user:test.analyst")

    def test_feature_engineering_metrics(self):
        cleaned = DataCleaner.clean(self.sample_raw_data)
        feats = FeatureEngineer.extract_entity_features(cleaned)
        self.assertGreater(feats["event_count"], 0)
        self.assertIn("hourly_entropy", feats)
        self.assertIn("auth_failure_ratio", feats)
        self.assertGreaterEqual(feats["hourly_entropy"], 0.0)

    def test_insufficient_history_safeguard(self):
        """CRITICAL: Verifies system does NOT fabricate baselines when observation history is insufficient (< 10)."""
        short_slice = self.sample_raw_data.iloc[:5] # Only 5 events
        cleaned = DataCleaner.clean(short_slice)
        prof = BaselineEngine.calculate_entity_profile("user:sparse.entity", cleaned, cleaned)
        self.assertEqual(prof["profile_status"], "INSUFFICIENT_HISTORY")
        self.assertEqual(prof["behavioral_deviation_index"], 0.0)
        self.assertFalse(prof["is_anomalous"])

    def test_baseline_calculation_with_sufficient_history(self):
        cleaned = DataCleaner.clean(self.sample_raw_data)
        base_slice = cleaned.iloc[:15]
        curr_slice = cleaned.iloc[15:]
        prof = BaselineEngine.calculate_entity_profile("user:test.analyst", base_slice, curr_slice)
        self.assertEqual(prof["profile_status"], "PROFILED")
        self.assertIn("behavioral_deviation_index", prof)
        self.assertIsInstance(prof["feature_deviations"], list)

    def test_isolation_forest_model_scoring(self):
        cleaned = DataCleaner.clean(self.sample_raw_data)
        matrix = FeatureEngineer.build_feature_matrix(cleaned)
        detector = AnomalyDetector(contamination=0.2)
        detector.fit_baseline_matrix(matrix)
        scored = detector.score_entities(matrix)
        self.assertIn("raw_anomaly_score", scored.columns)
        self.assertIn("model_risk_score", scored.columns)

    def test_correlation_engine_attack_chain_detection(self):
        # Construct explicit brute force sequence
        bf_events = pd.DataFrame([
            {
                "timestamp": (datetime(2026, 10, 5, 2, 0, tzinfo=timezone.utc) + timedelta(seconds=i*30)).isoformat(),
                "event_id": f"EVT-BF-{i}",
                "event_type": "AUTH_FAILURE",
                "entity_id": "user:victim.account",
                "entity_type": "USER",
                "severity": "MEDIUM",
                "source_ip": "198.51.100.99",
                "destination_ip": "10.0.1.10"
            }
            for i in range(5)
        ] + [
            {
                "timestamp": datetime(2026, 10, 5, 2, 5, tzinfo=timezone.utc).isoformat(),
                "event_id": "EVT-SUCCESS-01",
                "event_type": "AUTH_SUCCESS",
                "entity_id": "user:victim.account",
                "entity_type": "USER",
                "severity": "HIGH",
                "source_ip": "198.51.100.99",
                "destination_ip": "10.0.1.10"
            },
            {
                "timestamp": datetime(2026, 10, 5, 2, 10, tzinfo=timezone.utc).isoformat(),
                "event_id": "EVT-LATERAL-01",
                "event_type": "LATERAL_MOVEMENT",
                "entity_id": "user:victim.account",
                "entity_type": "USER",
                "severity": "CRITICAL",
                "source_ip": "10.0.1.10",
                "destination_ip": "10.0.2.20"
            }
        ])
        cleaned_bf = DataCleaner.clean(bf_events)
        chains = CorrelationEngine.reconstruct_attack_chains(cleaned_bf)
        self.assertGreaterEqual(len(chains), 1)
        self.assertIn("T1110", chains[0]["tactic_sequence"][0])
        self.assertEqual(chains[0]["primary_entity"], "user:victim.account")

    def test_spark_pipeline_rules(self):
        """Verifies the 3 explainable rules in the simplified Spark pipeline."""
        from analytics.cyberdna_pipeline.spark_pipeline import CyberDNASparkPipeline
        pipeline = CyberDNASparkPipeline()
        summaries = [
            {"entity_id": "user:elena.rostova", "total_events": 500, "usb_usage_count": 1, "file_access_count": 120, "off_hours_count": 10},
            {"entity_id": "user:marcus.wright", "total_events": 200, "usb_usage_count": 0, "file_access_count": 10, "off_hours_count": 8},
            {"entity_id": "user:david.clark", "total_events": 180, "usb_usage_count": 0, "file_access_count": 15, "off_hours_count": 4},
            {"entity_id": "user:rachel.kim", "total_events": 150, "usb_usage_count": 0, "file_access_count": 8, "off_hours_count": 0}
        ]
        dummy_df = pd.DataFrame([{"event_id": "EVT-1", "entity_id": "user:elena.rostova"}])
        findings = pipeline._apply_simple_rules(summaries, dummy_df)
        self.assertEqual(len(findings), 3)
        finding_ids = [f["id"] for f in findings]
        self.assertIn("ALERT-RULE-01", finding_ids)
        self.assertIn("ALERT-RULE-02", finding_ids)
        self.assertIn("ALERT-RULE-03", finding_ids)

        # Verify explainable questions exist on findings
        elena_alert = next(f for f in findings if f["id"] == "ALERT-RULE-01")
        self.assertIn("what_happened", elena_alert)
        self.assertIn("why_flagged", elena_alert)
        self.assertIn("employee_involved", elena_alert)
        self.assertIn("next_steps", elena_alert)

if __name__ == "__main__":
    unittest.main()

