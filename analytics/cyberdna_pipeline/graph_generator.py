"""
Grounded Entity-Relationship Graph Generator for Forensic Analysis
"""
from typing import Dict, Any, List, Set, Tuple
import pandas as pd

class GraphGenerator:
    """
    Builds an evidence-backed relationship graph where nodes represent entities
    and edges represent verifiable telemetry interactions.
    """

    @classmethod
    def generate_graph_from_events(cls, events_df: pd.DataFrame, max_nodes: int = 150) -> Dict[str, Any]:
        """
        Extracts verified nodes and edges from security events DataFrame.
        """
        nodes: Dict[str, Dict[str, Any]] = {}
        edges: List[Dict[str, Any]] = []
        edge_keys: Set[Tuple[str, str, str]] = set()

        def add_node(node_id: str, label: str, node_type: str, metadata: Dict[str, Any] = None):
            if node_id not in nodes and len(nodes) < max_nodes:
                nodes[node_id] = {
                    "id": node_id,
                    "label": label,
                    "type": node_type,
                    "event_count": 0,
                    "risk_level": "LOW",
                    "metadata": metadata or {}
                }
            if node_id in nodes:
                nodes[node_id]["event_count"] += 1

        for _, row in events_df.iterrows():
            ent_id = str(row["entity_id"]).strip()
            ent_type = str(row["entity_type"]).strip().upper()
            severity = str(row.get("severity", "INFO")).upper()

            add_node(ent_id, ent_id.split(":")[-1], ent_type, {
                "source_type": ent_type,
                "latest_event": row.get("event_type", "UNKNOWN")
            })

            # Elevate risk if high severity
            if ent_id in nodes:
                if severity in ["CRITICAL", "HIGH"]:
                    nodes[ent_id]["risk_level"] = "CRITICAL" if severity == "CRITICAL" else "HIGH"
                elif severity == "MEDIUM" and nodes[ent_id]["risk_level"] not in ["CRITICAL", "HIGH"]:
                    nodes[ent_id]["risk_level"] = "MEDIUM"

            # Connect with destination IP if available
            dest_ip = row.get("destination_ip")
            if pd.notna(dest_ip) and str(dest_ip).strip() and str(dest_ip) != "0.0.0.0":
                dest_node_id = f"ip:{dest_ip}"
                # Determine if private or external IP
                is_internal = str(dest_ip).startswith(("10.", "192.168.", "172.16."))
                ip_type = "IP_INTERNAL" if is_internal else "IP_EXTERNAL"

                add_node(dest_node_id, str(dest_ip), ip_type, {
                    "is_internal": is_internal,
                    "destination_port": row.get("destination_port", 0)
                })

                edge_key = (ent_id, dest_node_id, str(row.get("event_type")))
                if edge_key not in edge_keys:
                    edge_keys.add(edge_key)
                    edges.append({
                        "id": f"e-{len(edges)+1}",
                        "source": ent_id,
                        "target": dest_node_id,
                        "relationship": "NETWORK_CONNECTION" if "CONN" in str(row["event_type"]) else "INTERACTS_WITH",
                        "event_type": str(row.get("event_type", "")),
                        "timestamp": str(row.get("timestamp", "")),
                        "evidence_event_id": str(row.get("event_id", "")),
                        "port": int(row.get("destination_port", 0)) if pd.notna(row.get("destination_port")) else 0,
                        "bytes": float(row.get("bytes_transferred", 0)) if pd.notna(row.get("bytes_transferred")) else 0,
                        "protocol": str(row.get("protocol", "TCP"))
                    })

        return {
            "nodes": list(nodes.values()),
            "edges": edges,
            "total_nodes": len(nodes),
            "total_edges": len(edges)
        }
