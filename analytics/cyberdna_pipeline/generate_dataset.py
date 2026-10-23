"""
Realistic Security Telemetry Dataset Generator for Academic & Forensic Analysis
"""
import csv
import os
import random
from datetime import datetime, timedelta, timezone

def generate_security_dataset(output_path: str, num_events: int = 2500):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42)

    entities = [
        {"id": "user:alex.vance", "type": "USER", "role": "Financial Analyst"},
        {"id": "user:sarah.connor", "type": "USER", "role": "DevOps Engineer"},
        {"id": "user:david.clark", "type": "USER", "role": "Network Administrator"},
        {"id": "user:elena.rostova", "type": "USER", "role": "Contractor"},
        {"id": "user:service.backup", "type": "USER", "role": "Automated Service Account"},
        {"id": "user:marcus.wright", "type": "USER", "role": "Help Desk Specialist"},
        {"id": "host:WS-FIN-01", "type": "DEVICE", "role": "Workstation"},
        {"id": "host:WS-ENG-42", "type": "DEVICE", "role": "Workstation"},
        {"id": "host:WS-HR-12", "type": "DEVICE", "role": "Workstation"},
        {"id": "host:WS-EXEC-01", "type": "DEVICE", "role": "Executive Laptop"},
        {"id": "srv:DC01.corp.local", "type": "SERVER", "role": "Primary Domain Controller"},
        {"id": "srv:FILE01.corp.local", "type": "SERVER", "role": "Enterprise File Share"},
        {"id": "srv:SQL01.prod.local", "type": "SERVER", "role": "Production Database"},
        {"id": "srv:MAIL01.corp.local", "type": "SERVER", "role": "Exchange Server"},
        {"id": "ip:10.0.1.15", "type": "IP", "role": "Internal DHCP"},
        {"id": "ip:10.0.2.45", "type": "IP", "role": "Internal DMZ"},
        {"id": "ip:198.51.100.23", "type": "IP", "role": "External Suspicious IP"},
        {"id": "domain:storage-cloud-sync.net", "type": "DOMAIN", "role": "Unsanctioned Cloud Drop"},
    ]

    base_time = datetime(2026, 10, 10, 8, 0, 0, tzinfo=timezone.utc)
    events = []

    # Normal baseline events (first 10 days)
    for i in range(num_events - 300):
        ent = random.choice(entities[:14])
        # Daytime skewed hours (8am - 18pm)
        hour = random.choice([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, random.randint(0, 23)])
        day_offset = random.randint(0, 10)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        ts = base_time + timedelta(days=day_offset, hours=hour, minutes=minute, seconds=second)

        event_types = ["AUTH_SUCCESS", "NETWORK_CONNECTION", "PROCESS_SPAWN", "FILE_ACCESS", "DNS_QUERY"]
        evt_type = random.choice(event_types)
        severity = "INFO" if random.random() > 0.15 else "LOW"

        src_ip = f"10.0.{random.randint(1,4)}.{random.randint(10,250)}"
        dest_ip = f"10.0.{random.randint(1,4)}.{random.randint(10,250)}" if random.random() > 0.2 else f"151.101.{random.randint(1,250)}.{random.randint(1,250)}"
        dest_port = random.choice([443, 80, 445, 3389, 53, 88, 135])
        bytes_tx = random.randint(120, 45000)
        proc = random.choice(["explorer.exe", "chrome.exe", "slack.exe", "code.exe", "svchost.exe", "outlook.exe"])

        events.append({
            "timestamp": ts.isoformat(),
            "event_id": f"EVT-BASE-{i+1:05d}",
            "event_type": evt_type,
            "entity_id": ent["id"],
            "entity_type": ent["type"],
            "severity": severity,
            "source_ip": src_ip,
            "destination_ip": dest_ip,
            "destination_port": dest_port,
            "protocol": "TCP" if dest_port != 53 else "UDP",
            "bytes_transferred": bytes_tx,
            "process_name": proc,
            "rule_triggered": "BASELINE_TELEMETRY",
            "is_synthetic": 1
        })

    # Targeted Anomalies and Multi-Stage Attack Chains (Days 11-14)
    # Stage 1: Brute Force attack against user:elena.rostova from external IP
    attack_start = base_time + timedelta(days=11, hours=2, minutes=15)
    for j in range(12):
        events.append({
            "timestamp": (attack_start + timedelta(seconds=j * 15)).isoformat(),
            "event_id": f"EVT-ANOM-BF-{j+1:03d}",
            "event_type": "AUTH_FAILURE",
            "entity_id": "user:elena.rostova",
            "entity_type": "USER",
            "severity": "MEDIUM",
            "source_ip": "198.51.100.23",
            "destination_ip": "10.0.1.15",
            "destination_port": 443,
            "protocol": "TCP",
            "bytes_transferred": 850,
            "process_name": "vpn_auth.exe",
            "rule_triggered": "T1110_BRUTE_FORCE_BURST",
            "is_synthetic": 1
        })

    # Successful breach after brute force
    compromise_time = attack_start + timedelta(minutes=4)
    events.append({
        "timestamp": compromise_time.isoformat(),
        "event_id": "EVT-ANOM-AUTH-SUCCESS",
        "event_type": "AUTH_SUCCESS",
        "entity_id": "user:elena.rostova",
        "entity_type": "USER",
        "severity": "HIGH",
        "source_ip": "198.51.100.23",
        "destination_ip": "10.0.1.15",
        "destination_port": 443,
        "protocol": "TCP",
        "bytes_transferred": 4200,
        "process_name": "vpn_service.exe",
        "rule_triggered": "T1078_VALID_ACCOUNTS_ANOMALOUS_GEO",
        "is_synthetic": 1
    })

    # Stage 2: Suspicious Process Spawns on host:WS-FIN-01
    suspicious_procs = ["powershell.exe -enc SQBFAFgA...", "whoami.exe /priv", "net.exe group 'Domain Admins' /domain", "mimikatz.exe"]
    for idx, proc in enumerate(suspicious_procs):
        events.append({
            "timestamp": (compromise_time + timedelta(minutes=15 + idx * 5)).isoformat(),
            "event_id": f"EVT-ANOM-PROC-{idx+1:03d}",
            "event_type": "PROCESS_SPAWN",
            "entity_id": "host:WS-FIN-01",
            "entity_type": "DEVICE",
            "severity": "CRITICAL" if "mimikatz" in proc else "HIGH",
            "source_ip": "10.0.1.15",
            "destination_ip": "10.0.2.45",
            "destination_port": 445,
            "protocol": "TCP",
            "bytes_transferred": 12800,
            "process_name": proc,
            "rule_triggered": "T1059_SUSPICIOUS_SCRIPT_EXECUTION",
            "is_synthetic": 1
        })

    # Stage 3: Lateral Movement to srv:DC01.corp.local & srv:SQL01.prod.local
    events.append({
        "timestamp": (compromise_time + timedelta(minutes=45)).isoformat(),
        "event_id": "EVT-ANOM-LATERAL-001",
        "event_type": "LATERAL_MOVEMENT",
        "entity_id": "srv:DC01.corp.local",
        "entity_type": "SERVER",
        "severity": "CRITICAL",
        "source_ip": "10.0.1.15",
        "destination_ip": "10.0.2.10",
        "destination_port": 3389,
        "protocol": "TCP",
        "bytes_transferred": 450000,
        "process_name": "mstsc.exe",
        "rule_triggered": "T1021_REMOTE_SERVICES_RDP",
        "is_synthetic": 1
    })

    # Stage 4: Off-Hours Mass Data Exfiltration
    exfil_time = compromise_time + timedelta(hours=2, minutes=10)
    for k in range(5):
        events.append({
            "timestamp": (exfil_time + timedelta(minutes=k * 10)).isoformat(),
            "event_id": f"EVT-ANOM-EXFIL-{k+1:03d}",
            "event_type": "DATA_EXFILTRATION",
            "entity_id": "srv:SQL01.prod.local",
            "entity_type": "SERVER",
            "severity": "CRITICAL",
            "source_ip": "10.0.2.45",
            "destination_ip": "198.51.100.23",
            "destination_port": 8443,
            "protocol": "TCP",
            "bytes_transferred": random.randint(180_000_000, 320_000_000), # 180MB-320MB chunks
            "process_name": "curl.exe",
            "rule_triggered": "T1048_EXFILTRATION_OVER_ALTERNATIVE_PROTOCOL",
            "is_synthetic": 1
        })

    # Stage 5: Domain C2 beaconing
    for m in range(8):
        events.append({
            "timestamp": (compromise_time + timedelta(hours=1, minutes=m * 15)).isoformat(),
            "event_id": f"EVT-ANOM-DNS-{m+1:03d}",
            "event_type": "DNS_QUERY",
            "entity_id": "domain:storage-cloud-sync.net",
            "entity_type": "DOMAIN",
            "severity": "HIGH",
            "source_ip": "10.0.1.15",
            "destination_ip": "8.8.8.8",
            "destination_port": 53,
            "protocol": "UDP",
            "bytes_transferred": 340,
            "process_name": "dns_cache.exe",
            "rule_triggered": "T1071_APPLICATION_LAYER_C2_DNS",
            "is_synthetic": 1
        })

    # Sort all events chronologically
    events.sort(key=lambda x: x["timestamp"])

    # Write CSV
    keys = [
        "timestamp", "event_id", "event_type", "entity_id", "entity_type",
        "severity", "source_ip", "destination_ip", "destination_port",
        "protocol", "bytes_transferred", "process_name", "rule_triggered", "is_synthetic"
    ]

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(events)

    print(f"Generated {len(events)} security events at {output_path}")

if __name__ == "__main__":
    generate_security_dataset("analytics/datasets/sample_security_events.csv")
