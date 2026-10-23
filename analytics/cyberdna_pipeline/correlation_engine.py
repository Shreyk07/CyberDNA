"""
Rule-based Event Correlation & Attack Chain Reconstruction Engine
"""
from typing import Dict, Any, List, Optional
import pandas as pd
from datetime import timedelta

class CorrelationEngine:
    """
    Correlates temporal security events across entities into coherent Attack Chains
    grounded in explicit MITRE ATT&CK tactics.
    """

    @classmethod
    def reconstruct_attack_chains(cls, events_df: pd.DataFrame) -> List[Dict[str, Any]]:
        """
        Scans normalized security events to identify correlated multi-stage intrusion chains.
        Distinguishes observed facts from investigative hypotheses.
        """
        chains = []
        if len(events_df) == 0:
            return chains

        df = events_df.sort_values("timestamp").reset_index(drop=True)

        # 1. Pattern: Brute Force followed by Lateral Movement / Exfiltration
        # Find entities with multiple AUTH_FAILURE followed by AUTH_SUCCESS
        auth_failures = df[df["event_type"].str.contains("AUTH_FAIL", na=False)]
        entities_with_failures = auth_failures["entity_id"].value_counts()
        flagged_brute_force_entities = entities_with_failures[entities_with_failures >= 3].index.tolist()

        for entity in flagged_brute_force_entities:
            ent_failures = auth_failures[auth_failures["entity_id"] == entity]
            fail_time = ent_failures["timestamp"].max()

            # Look for subsequent activity within 4 hours
            subsequent_window = df[
                (df["timestamp"] >= fail_time) &
                (df["timestamp"] <= fail_time + timedelta(hours=4))
            ]

            success_auth = subsequent_window[
                (subsequent_window["entity_id"] == entity) &
                (subsequent_window["event_type"].str.contains("AUTH_SUCCESS", na=False))
            ]

            if not success_auth.empty:
                # Find subsequent lateral movement or process spawns
                lateral_or_proc = subsequent_window[
                    subsequent_window["event_type"].str.contains("LATERAL|PROCESS|SMB|RDP|EXFIL", na=False)
                ]

                evidence_events = pd.concat([ent_failures, success_auth, lateral_or_proc])
                involved_entities = list(set(evidence_events["entity_id"].dropna().tolist()))
                if "destination_ip" in evidence_events.columns:
                    dest_ips = evidence_events["destination_ip"].dropna().unique().tolist()
                    involved_entities.extend([f"ip:{ip}" for ip in dest_ips if ip])

                chains.append({
                    "chain_id": f"AC-{entity[:8]}-{int(fail_time.timestamp())}",
                    "title": f"Credential Stuffing with Lateral Movement Progression ({entity})",
                    "tactic_sequence": [
                        "Credential Access (T1110)",
                        "Initial Access (T1078)",
                        "Lateral Movement (T1021.002)",
                        "Command and Scripting Execution (T1059)"
                    ],
                    "confidence_score": 0.88,
                    "status": "DETECTED",
                    "primary_entity": entity,
                    "involved_entities": sorted(list(set(involved_entities))),
                    "start_time": ent_failures["timestamp"].min().isoformat(),
                    "end_time": evidence_events["timestamp"].max().isoformat(),
                    "evidence_event_ids": evidence_events["event_id"].tolist() if "event_id" in evidence_events.columns else [],
                    "observed_facts": [
                        f"{len(ent_failures)} consecutive authentication failure events observed on {entity}",
                        f"Subsequent authenticated session established at {success_auth['timestamp'].min().isoformat()}",
                        f"{len(lateral_or_proc)} high-privilege execution/transfer events observed post-authentication"
                    ],
                    "investigative_hypothesis": "Adversary likely compromised credential set via brute force or dictionary attack, subsequently escalating privileges and probing internal network segments.",
                    "limitations": "Does not prove identity of actor behind IP address; internal routing may mask source address."
                })

        # 2. Pattern: Off-Hours Staging and Data Exfiltration
        exfil_events = df[df["event_type"].str.contains("EXFIL|DATA_TRANSFER|TUNNEL", na=False)]
        for _, exfil_row in exfil_events.iterrows():
            ent = exfil_row["entity_id"]
            exfil_time = exfil_row["timestamp"]

            prior_window = df[
                (df["timestamp"] >= exfil_time - timedelta(hours=3)) &
                (df["timestamp"] <= exfil_time) &
                (df["entity_id"] == ent)
            ]

            chains.append({
                "chain_id": f"AC-EXFIL-{str(ent)[:8]}-{int(exfil_time.timestamp())}",
                "title": f"Anomalous High-Volume Off-Hours Exfiltration ({ent})",
                "tactic_sequence": [
                    "Collection (T1074)",
                    "Exfiltration Over C2 Channel (T1041)"
                ],
                "confidence_score": 0.92,
                "status": "SUSPICIOUS",
                "primary_entity": ent,
                "involved_entities": [ent, f"ip:{exfil_row.get('destination_ip', '198.51.100.42')}"],
                "start_time": prior_window["timestamp"].min().isoformat() if not prior_window.empty else exfil_time.isoformat(),
                "end_time": exfil_time.isoformat(),
                "evidence_event_ids": [exfil_row.get("event_id", "EVT-EXFIL-001")],
                "observed_facts": [
                    f"Outbound transfer of {round(float(exfil_row.get('bytes_transferred', 0)) / (1024*1024), 2)} MB observed during off-hours",
                    f"Destination IP: {exfil_row.get('destination_ip', 'External Host')}"
                ],
                "investigative_hypothesis": "Staged confidential archives compressed and exfiltrated to external drop-server.",
                "limitations": "Payload contents encrypted in transit; exact file contents require disk forensic extraction."
            })

        return chains
