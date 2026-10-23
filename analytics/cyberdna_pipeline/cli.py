"""
CyberDNA Analytical Pipeline CLI
Orchestrates ingestion, baseline computation, Isolation Forest anomaly detection,
correlation, and attack-graph extraction.
"""
import argparse
import json
import os
import sys
import pandas as pd
import numpy as np

# Allow running as direct script or package
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(parent_dir)
for p in [current_dir, parent_dir, root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from .schema_validation import SchemaValidator
    from .data_cleaning import DataCleaner
    from .feature_engineering import FeatureEngineer
    from .baseline_engine import BaselineEngine
    from .anomaly_detector import AnomalyDetector
    from .correlation_engine import CorrelationEngine
    from .graph_generator import GraphGenerator
except (ImportError, ValueError):
    from schema_validation import SchemaValidator
    from data_cleaning import DataCleaner
    from feature_engineering import FeatureEngineer
    from baseline_engine import BaselineEngine
    from anomaly_detector import AnomalyDetector
    from correlation_engine import CorrelationEngine
    from graph_generator import GraphGenerator

def run_pipeline(input_csv: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    print(f"[*] Starting CyberDNA Pipeline on: {input_csv}")

    # 1. Ingestion & Validation
    if not os.path.exists(input_csv):
        print(f"[!] Error: File not found {input_csv}")
        sys.exit(1)

    raw_df = pd.read_csv(input_csv)
    is_valid, val_report = SchemaValidator.validate_dataframe(raw_df)
    if not is_valid:
        print(f"[!] Validation failed: {val_report}")
        sys.exit(1)
    print(f"[+] Schema validation passed: {len(raw_df)} events verified.")

    # 2. Cleaning & Normalization
    clean_df = DataCleaner.clean(raw_df)
    print(f"[+] Data cleaned and normalized. Date range: {clean_df['timestamp'].min()} to {clean_df['timestamp'].max()}")

    # 3. Baseline & Current Split
    baseline_df, current_df = BaselineEngine.split_baseline_and_current(clean_df, split_ratio=0.70)
    print(f"[+] Split dataset: {len(baseline_df)} baseline reference events, {len(current_df)} current evaluation events.")

    # 4. Feature Matrix Construction
    base_matrix = FeatureEngineer.build_feature_matrix(baseline_df)
    curr_matrix = FeatureEngineer.build_feature_matrix(current_df)

    # 5. Isolation Forest Unsupervised Anomaly Detection
    detector = AnomalyDetector(contamination=0.15, random_state=42)
    detector.fit_baseline_matrix(base_matrix)
    scored_current = detector.score_entities(curr_matrix)

    # 6. Entity Behavioral Profiles & Deviation calculation
    entities = clean_df["entity_id"].unique()
    profiles = []
    for ent_id in entities:
        ent_base = baseline_df[baseline_df["entity_id"] == ent_id]
        ent_curr = current_df[current_df["entity_id"] == ent_id]
        prof = BaselineEngine.calculate_entity_profile(ent_id, ent_base, ent_curr)

        # Merge Isolation Forest Model scores if available
        if ent_id in scored_current.index:
            prof["isolation_forest_risk_score"] = float(scored_current.loc[ent_id, "model_risk_score"])
            prof["isolation_forest_anomaly"] = bool(scored_current.loc[ent_id, "is_isolation_anomaly"])
            prof["raw_anomaly_score"] = round(float(scored_current.loc[ent_id, "raw_anomaly_score"]), 4)
        else:
            prof["isolation_forest_risk_score"] = 0.0
            prof["isolation_forest_anomaly"] = False
            prof["raw_anomaly_score"] = 0.0

        profiles.append(prof)

    # 7. Attack-Chain Reconstruction & Correlation
    attack_chains = CorrelationEngine.reconstruct_attack_chains(clean_df)
    print(f"[+] Correlated {len(attack_chains)} distinct multi-stage attack chains.")

    # 8. Grounded Entity Graph
    graph_data = GraphGenerator.generate_graph_from_events(clean_df, max_nodes=100)
    print(f"[+] Generated entity relationship graph: {graph_data['total_nodes']} nodes, {graph_data['total_edges']} edges.")

    # 9. Export Artifacts
    # Parquet export for Big Data persistence
    parquet_path = os.path.join(output_dir, "processed_security_events.parquet")
    clean_df.to_parquet(parquet_path, index=False)
    print(f"[+] Exported Parquet dataset: {parquet_path}")

    # JSON summary report
    summary = {
        "pipeline_version": "1.0.0",
        "dataset_path": input_csv,
        "total_events_processed": len(clean_df),
        "total_entities_profiled": len(profiles),
        "anomalous_entities_count": sum(1 for p in profiles if p.get("is_anomalous")),
        "correlated_attack_chains_count": len(attack_chains),
        "validation_report": val_report,
        "profiles": profiles,
        "attack_chains": attack_chains,
        "graph": graph_data
    }

    summary_path = os.path.join(output_dir, "pipeline_results.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print(f"[+] Exported pipeline results to: {summary_path}")
    print("[*] CyberDNA Big Data Analytics Pipeline execution completed successfully.")
    return summary

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CyberDNA Analytics Pipeline CLI")
    parser.add_argument("--input", default="analytics/datasets/sample_security_events.csv", help="Input security events CSV")
    parser.add_argument("--output", default="analytics/output", help="Output directory for processed artifacts")
    args = parser.parse_args()

    run_pipeline(args.input, args.output)
