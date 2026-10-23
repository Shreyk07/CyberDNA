"""
CyberDNA Realistic Enterprise Insider-Threat Activity Dataset Generator
Simulates employee activities within a corporate environment (Apex Global Technologies)
conforming to CERT Insider Threat data schemas (Logon, Device/USB, File, Web, Email).
"""
import csv
import os
import random
from datetime import datetime, timedelta, timezone

def generate_security_dataset(output_path: str, num_events: int = 2500):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    random.seed(42)

    employees = [
        {"id": "user:elena.rostova", "name": "Elena Rostova", "department": "Finance", "role": "Senior Financial Controller", "status": "NOTICE_PERIOD", "device": "host:WS-FIN-01"},
        {"id": "user:alex.vance", "name": "Alex Vance", "department": "Finance", "role": "Budget Analyst", "status": "ACTIVE", "device": "host:WS-FIN-02"},
        {"id": "user:sarah.connor", "name": "Sarah Connor", "department": "Engineering", "role": "Lead DevOps Architect", "status": "ACTIVE", "device": "host:WS-ENG-42"},
        {"id": "user:david.clark", "name": "David Clark", "department": "Engineering", "role": "Senior Cloud Infrastructure Engineer", "status": "ACTIVE", "device": "host:WS-ENG-19"},
        {"id": "user:marcus.wright", "name": "Marcus Wright", "department": "IT Operations", "role": "Systems & Helpdesk Administrator", "status": "ACTIVE", "device": "host:WS-IT-08"},
        {"id": "user:rachel.kim", "name": "Rachel Kim", "department": "Human Resources", "role": "HR Director & People Operations", "status": "ACTIVE", "device": "host:WS-HR-05"},
        {"id": "user:jonathan.hayes", "name": "Jonathan Hayes", "department": "Legal & Compliance", "role": "Corporate Legal Counsel", "status": "ACTIVE", "device": "host:WS-LEG-01"},
        {"id": "user:lisa.tanaka", "name": "Lisa Tanaka", "department": "Sales & Accounts", "role": "Enterprise Account Executive", "status": "ACTIVE", "device": "host:WS-SALES-11"},
        {"id": "user:carlos.mendez", "name": "Carlos Mendez", "department": "Sales & Accounts", "role": "Client Solutions Manager", "status": "ACTIVE", "device": "host:WS-SALES-14"},
        {"id": "user:maya.patel", "name": "Maya Patel", "department": "Engineering", "role": "Backend Software Engineer", "status": "ACTIVE", "device": "host:WS-ENG-07"},
        {"id": "user:kevin.zhang", "name": "Kevin Zhang", "department": "Finance", "role": "Treasury Specialist", "status": "ACTIVE", "device": "host:WS-FIN-03"},
        {"id": "user:service.backup", "name": "Automated Backup Daemon", "department": "IT Operations", "role": "Scheduled Service Account", "status": "ACTIVE", "device": "srv:BACKUP01"},
    ]

    devices = [
        "host:WS-FIN-01", "host:WS-FIN-02", "host:WS-ENG-42", "host:WS-ENG-19",
        "host:WS-IT-08", "host:WS-HR-05", "host:WS-LEG-01", "host:WS-SALES-11"
    ]

    servers = [
        "srv:DC01.corp.local", "srv:FILE01.corp.local", "srv:SQL01.prod.local", "srv:CODE01.git.local"
    ]

    base_time = datetime(2026, 10, 1, 8, 0, 0, tzinfo=timezone.utc)
    events = []

    # 1. Normal Baseline Events across employees (first 14 days)
    for i in range(num_events - 350):
        emp = random.choice(employees)
        # Normal daytime skewed distribution (08:30 to 17:30 UTC)
        hour = random.choice([8, 9, 9, 10, 10, 11, 12, 13, 14, 14, 15, 16, 17, 18])
        day_offset = random.randint(0, 14)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        ts = base_time + timedelta(days=day_offset, hours=hour, minutes=minute, seconds=second)

        evt_type = random.choice([
            "LOGON", "LOGOFF", "FILE_ACCESS", "FILE_COPY", "WEB_ACCESS", "EMAIL_SENT"
        ])
        severity = "INFO" if random.random() > 0.08 else "LOW"

        src_ip = f"10.0.{random.randint(1, 4)}.{random.randint(10, 250)}"
        dest_ip = f"10.0.{random.randint(1, 4)}.{random.randint(10, 250)}" if random.random() > 0.3 else f"142.250.{random.randint(1, 200)}.{random.randint(1, 250)}"
        dest_port = random.choice([443, 80, 445, 3389, 53, 88])
        bytes_tx = random.randint(250, 48000)
        proc = random.choice(["explorer.exe", "chrome.exe", "excel.exe", "teams.exe", "outlook.exe", "code.exe"])

        target = "C:\\Corporate\\Reports\\Weekly_Summary.docx" if evt_type.startswith("FILE") else "intranet.apex-global.corp"

        events.append({
            "timestamp": ts.isoformat(),
            "event_id": f"ACT-BASE-{i+1:05d}",
            "event_type": evt_type,
            "entity_id": emp["id"],
            "entity_type": "EMPLOYEE",
            "severity": severity,
            "source_ip": src_ip,
            "destination_ip": dest_ip,
            "destination_port": dest_port,
            "protocol": "TCP" if dest_port != 53 else "UDP",
            "bytes_transferred": bytes_tx,
            "process_name": proc,
            "rule_triggered": "BASELINE_NORMAL_ACTIVITY",
            "is_synthetic": 1
        })

    # 2. Targeted Insider Threat Scenario 1: Elena Rostova (Finance - Notice Period Data Hoarding)
    # Background: Submitted resignation. Downloads proprietary financial models & copies to unauthorized USB.
    notice_time = base_time + timedelta(days=15, hours=20, minutes=15) # Off-hours: 8:15 PM
    # Off-hours logon
    events.append({
        "timestamp": notice_time.isoformat(),
        "event_id": "ACT-INSD-ELENA-001",
        "event_type": "LOGON",
        "entity_id": "user:elena.rostova",
        "entity_type": "EMPLOYEE",
        "severity": "MEDIUM",
        "source_ip": "10.0.1.15",
        "destination_ip": "10.0.2.10",
        "destination_port": 445,
        "protocol": "TCP",
        "bytes_transferred": 1400,
        "process_name": "logon.exe",
        "rule_triggered": "ANOM_OFF_HOURS_LOGON_NOTICE_PERIOD",
        "is_synthetic": 1
    })

    # Massive file access to sensitive M&A directory
    sensitive_files = [
        "M&A_Valuation_Model_Q3.xlsx", "Confidential_Client_Ledger_2026.csv",
        "Executive_Stock_Options_Audit.pdf", "Apex_Patent_Valuation_Draft.docx",
        "Customer_Retention_Pricing_Matrix.xlsx"
    ]
    for idx, f_name in enumerate(sensitive_files):
        events.append({
            "timestamp": (notice_time + timedelta(minutes=5 + idx * 2)).isoformat(),
            "event_id": f"ACT-INSD-ELENA-FILE-{idx+1:03d}",
            "event_type": "FILE_ACCESS",
            "entity_id": "user:elena.rostova",
            "entity_type": "EMPLOYEE",
            "severity": "HIGH",
            "source_ip": "10.0.1.15",
            "destination_ip": "10.0.2.45",
            "destination_port": 445,
            "protocol": "TCP",
            "bytes_transferred": random.randint(12_000_000, 35_000_000),
            "process_name": "excel.exe",
            "rule_triggered": "ANOM_BULK_SENSITIVE_FILE_ACCESS",
            "is_synthetic": 1
        })

    # USB Insertion on WS-FIN-01
    usb_time = notice_time + timedelta(minutes=22)
    events.append({
        "timestamp": usb_time.isoformat(),
        "event_id": "ACT-INSD-ELENA-USB-01",
        "event_type": "REMOVABLE_CONNECT",
        "entity_id": "user:elena.rostova",
        "entity_type": "EMPLOYEE",
        "severity": "HIGH",
        "source_ip": "10.0.1.15",
        "destination_ip": "127.0.0.1",
        "destination_port": 0,
        "protocol": "USB",
        "bytes_transferred": 0,
        "process_name": "usbhub.sys",
        "rule_triggered": "POLICY_UNAUTHORIZED_USB_DEVICE_INSERTED",
        "is_synthetic": 1
    })

    # Bulk copy to USB drive (850 MB total)
    events.append({
        "timestamp": (usb_time + timedelta(minutes=3)).isoformat(),
        "event_id": "ACT-INSD-ELENA-USB-COPY",
        "event_type": "FILE_COPY",
        "entity_id": "user:elena.rostova",
        "entity_type": "EMPLOYEE",
        "severity": "CRITICAL",
        "source_ip": "10.0.1.15",
        "destination_ip": "127.0.0.1",
        "destination_port": 0,
        "protocol": "USB",
        "bytes_transferred": 850_000_000, # 850 MB
        "process_name": "robocopy.exe",
        "rule_triggered": "ANOM_MASS_REMOVABLE_STORAGE_EXFILTRATION",
        "is_synthetic": 1
    })

    # Unsanctioned Cloud Upload to personal storage
    events.append({
        "timestamp": (usb_time + timedelta(minutes=15)).isoformat(),
        "event_id": "ACT-INSD-ELENA-CLOUD-UP",
        "event_type": "CLOUD_UPLOAD",
        "entity_id": "user:elena.rostova",
        "entity_type": "EMPLOYEE",
        "severity": "CRITICAL",
        "source_ip": "10.0.1.15",
        "destination_ip": "198.51.100.23",
        "destination_port": 443,
        "protocol": "TCP",
        "bytes_transferred": 279_000_000, # 279 MB
        "process_name": "chrome.exe",
        "rule_triggered": "ANOM_UNSANCTIONED_CLOUD_STORAGE_UPLOAD",
        "is_synthetic": 1
    })

    # 3. Targeted Insider Threat Scenario 2: Marcus Wright (IT Admin Privilege Escalation)
    it_time = base_time + timedelta(days=16, hours=23, minutes=10) # 11:10 PM off hours
    events.append({
        "timestamp": it_time.isoformat(),
        "event_id": "ACT-INSD-MARCUS-001",
        "event_type": "LOGON",
        "entity_id": "user:marcus.wright",
        "entity_type": "EMPLOYEE",
        "severity": "MEDIUM",
        "source_ip": "10.0.3.12",
        "destination_ip": "10.0.1.5",
        "destination_port": 3389,
        "protocol": "TCP",
        "bytes_transferred": 2100,
        "process_name": "mstsc.exe",
        "rule_triggered": "ANOM_OFF_HOURS_ADMIN_SESSION",
        "is_synthetic": 1
    })

    for p_idx, proc_cmd in enumerate(["whoami.exe /priv", "net.exe group 'Domain Admins' /domain", "mimikatz.exe sekurlsa::logonpasswords"]):
        events.append({
            "timestamp": (it_time + timedelta(minutes=4 + p_idx * 3)).isoformat(),
            "event_id": f"ACT-INSD-MARCUS-PROC-{p_idx+1:03d}",
            "event_type": "PROCESS_SPAWN",
            "entity_id": "user:marcus.wright",
            "entity_type": "EMPLOYEE",
            "severity": "CRITICAL" if "mimikatz" in proc_cmd else "HIGH",
            "source_ip": "10.0.3.12",
            "destination_ip": "10.0.1.5",
            "destination_port": 445,
            "protocol": "TCP",
            "bytes_transferred": 35000,
            "process_name": proc_cmd,
            "rule_triggered": "T1059_CREDENTIAL_DUMPING_ATTEMPT",
            "is_synthetic": 1
        })

    # 4. Targeted Insider Threat Scenario 3: David Clark (Engineering DNS Tunneling)
    dns_time = base_time + timedelta(days=17, hours=1, minutes=45) # 1:45 AM
    for d_idx in range(10):
        events.append({
            "timestamp": (dns_time + timedelta(minutes=d_idx * 6)).isoformat(),
            "event_id": f"ACT-INSD-DAVID-DNS-{d_idx+1:03d}",
            "event_type": "DNS_QUERY",
            "entity_id": "user:david.clark",
            "entity_type": "EMPLOYEE",
            "severity": "HIGH",
            "source_ip": "10.0.2.19",
            "destination_ip": "8.8.8.8",
            "destination_port": 53,
            "protocol": "UDP",
            "bytes_transferred": 1400,
            "process_name": "nslookup.exe",
            "rule_triggered": "ANOM_BURST_DNS_TUNNEL_EXFILTRATION",
            "is_synthetic": 1
        })

    # Sort chronologically
    events.sort(key=lambda x: x["timestamp"])

    keys = [
        "timestamp", "event_id", "event_type", "entity_id", "entity_type",
        "severity", "source_ip", "destination_ip", "destination_port",
        "protocol", "bytes_transferred", "process_name", "rule_triggered", "is_synthetic"
    ]

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(events)

    print(f"[+] Generated {len(events)} company insider threat events at {output_path}")

if __name__ == "__main__":
    generate_security_dataset("analytics/datasets/sample_security_events.csv")
