# CyberDNA — Behavioral Fingerprinting & Digital Forensics Platform

> *"Understand behavior. Uncover what changed."*

[![Academic Portfolio](https://img.shields.io/badge/Academic-Master's%20in%20Cybersecurity-171717?style=flat-square)](#)
[![Python Pipeline](https://img.shields.io/badge/Pipeline-Python%203.13%20%7C%20Scikit--Learn-171717?style=flat-square)](#)
[![Backend](https://img.shields.io/badge/API-Node.js%20%7C%20Express%20%7C%20TypeScript-171717?style=flat-square)](#)
[![Frontend](https://img.shields.io/badge/UI-React%2019%20%7C%20Vite%20%7C%20TailwindCSS-171717?style=flat-square)](#)
[![Tests](https://img.shields.io/badge/Unit%20Tests-8%2F8%20Passing-16A34A?style=flat-square)](#)

---

## 1. Product Overview

**CyberDNA** is a behavioral analytics and digital forensics platform designed for advanced threat hunting, insider threat discovery, and evidence-grounded 
incident response. Built for a **Master's in Cybersecurity** thesis portfolio, the platform processes enterprise-scale security telemetry, derives mathematical 
behavioral baselines without temporal data leakage, identifies anomalous multi-dimensional deviations, correlates related events into MITRE ATT&CK progressions,
and constructs forensic investigation dossiers.

---

## 2. Core Technical Innovation & Product Flow

The application provides a complete, professional product experience with three distinct stages:

1. **Stage 1 — Public Homepage (`/`)**:

   - Architectural monochrome photography with high contrast and geometric concrete lines.
   - Restrained typography (Inter & Manrope), deliberate negative space, and coordinate stamps.
   - Detailed platform capabilities, 6-stage telemetry processing pipeline, research methodology, and evidence standards (*"An anomaly is not proof of malicious
   intent"*).

2. **Stage 2 — Dedicated Login Page (`/login`)**:

   - Minimalist, editorial authentication view.
   - **1-Click Instant Demo Access** button that automatically signs into the research workspace.
   - Clearly displayed fictional demonstration credentials (`analyst.demo@cyberdna.research` / `Forensics2026!`).

3. **Stage 3 — Authenticated Forensic Dashboard (`/dashboard`)**:

   - Access to all 10 core forensic intelligence modules.
   - Working **Sign Out / Logout** action that clears authenticated session state.
   - Direct link to return to the public site at any time.

CyberDNA establishes **Behavioral DNA** profiles for entities across 5 distinct scopes:

1. **Identities** (`USER`) — Authentication failure rates, off-hours velocity, role deviations.
2. **Endpoints** (`DEVICE`) — Process lineage, parent-child execution anomalies.
3. **Infrastructure** (`SERVER`) — Domain controllers, database clusters, lateral movement staging.
4. **Network Nodes** (`IP`) — Internal DMZ vs external anomalous routing, socket distribution.
5. **DNS & Storage** (`DOMAIN`) — C2 beaconing, unsanctioned cloud exfiltration sinks.

### Anti-Hallucination & Evidentiary Safeguards

- **Epistemic Partitioning**: Observed telemetry facts (immutable timestamps, socket pairs, byte counts) are strictly separated from investigative hypotheses 
(threat actor attribution).
- **Minimum History Rule**: Entities with fewer than 10 historical events are categorized as `INSUFFICIENT_HISTORY`. The platform refuses to fabricate 
artificial baselines or false anomaly alerts when statistical power is insufficient.
- **Anomaly $\neq$ Malice**: Statistical divergence is recognized as an anomaly indicator, not definitive proof of adversary intent without corroborating 
memory/disk artifacts.

---

## 3. Mathematical & Analytical Architecture

```
+---------------------------------------------------------------------------------------+
|                                CYBERDNA SYSTEM ARCHITECTURE                            |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|   [ Security Telemetry ] ----> [ Schema Validation ] ----> [ Normalization & Cleaning ]|
|   (CSV / JSON / Parquet)       (Column & Type Sanity)      (UTC, Diurnal & Socket Imput)|
|                                                                    |                  |
|                                                                    v                  |
|   [ Parquet Partition Store ] <------------------------ [ Chronological Split ]       |
|   (Columnar Big Data Storage)                           (70% Baseline / 30% Current)  |
|                                                                    |                  |
|                                                                    v                  |
|                                                      [ Feature Engineering Matrix ]   |
|                                                      (Shannon Entropy, Diversity, Tx) |
|                                                                    |                  |
|                       +--------------------------------------------+                  |
|                       |                                            |                  |
|                       v                                            v                  |
|             [ Statistical Z-Score ]                      [ Isolation Forest ]         |
|             (Modified MAD Z-Score)                       (100 Trees Ensemble)         |
|                       |                                            |                  |
|                       +---------------------+----------------------+                  |
|                                             |                                         |
|                                             v                                         |
|                             [ Behavioral Deviation Index (BDI) ]                      |
|                             (Weighted Multi-Attribute Scoring)                        |
|                                             |                                         |
|                                             v                                         |
|                             [ MITRE ATT&CK Correlation Engine ]                       |
|                             (Temporal Tactic Reconstructions)                         |
|                                             |                                         |
|                                             v                                         |
|   [ Express REST API ] <---> [ Grounded Graph ] <---> [ Forensic Investigation Dossier|
|   (Port 3001)                (Interactive SVG)        (Exportable Markdown / Notes)   |
|                                             |                                         |
|                                             v                                         |
|                                 [ React 19 Frontend ]                                 |
|                                 (Dark Forensic UI)                                    |
+---------------------------------------------------------------------------------------+
```

### Mathematical Formulations

#### 1. Shannon Hourly Entropy

Captures the dispersion of an entity's telemetry across the 24 hours of the day:
$$H(\text{Hour}) = - \sum_{h=0}^{23} p(h) \cdot \log_2(p(h))$$
*Bounds*: $0.0$ (activity concentrated in a single hour) to $4.58$ (activity evenly dispersed across all 24 hours).

#### 2. Modified Z-Score (Median Absolute Deviation)

Robust against extreme statistical outliers in baseline estimation:
$$M_i = \frac{0.6745 \cdot (x_i - \text{Median}(X))}{\max(\text{MAD}, \epsilon)}$$
where $\text{MAD} = \text{Median}(|X - \text{Median}(X)|)$.

#### 3. Composite Behavioral Deviation Index (BDI)

$$BDI = \min\left(100, \sqrt{\frac{\sum_j w_j Z_{ij}^2}{\sum_j w_j}} \times 22.0\right)$$
where $w_j$ assigns higher evidentiary weight to high-risk dimensions (authentication failure bursts: $2.5\times$, off-hours exfiltration volume: $2.0\times$).

---

## 4. Application Modules & Navigation

The platform features a persistent sidebar with 10 fully interactive dashboard modules:

1. **Overview Dashboard**

   - Key metrics: Events Processed (2,231), Entities Profiled (15), Flagged Deviations (3), Open Investigations (5), Correlated Chains (6).
   - Daily event velocity bar chart and CVSS severity distribution.
   - Ranked table of entities with greatest behavioral deviations.
   - Correlated investigation cards and data ingestion status.

2. **Entity DNA**

   - High-density directory with search, type filtration (`USER`, `DEVICE`, `SERVER`, `DOMAIN`), and anomaly toggling.
   - Slide-over Behavioral Fingerprint Drawer:
     - 24-hour diurnal histogram comparing historical baseline vs current observation window.
     - Feature-level deviation table (baseline, current, absolute shift, % change, Z-score, severity).
     - Filtered event telemetry stream for selected entity.
     - One-click "Initiate Investigation" action.

3. **Security Alerts / Findings**

   - Explainable, rule-based alerts for unusual employee activity, with a reviewer notice that an alert is not proof of wrongdoing.
   - Search and filter by finding category and review status.
   - Categories include Notice Period / Pre-Departure Data Hoarding, Privilege Escalation & Memory Access, and Anomalous DNS Tunneling / Exfiltration.
   - Open a finding to see its explanation, anomaly score, MITRE ATT&CK tactic, supporting telemetry events, and recommended next steps.
   - Update a finding's review status (`NEW`, `UNDER_REVIEW`, `ESCALATED`, `BENIGN`, `RESOLVED`) and navigate from a finding to its employee or investigation.

4. **Investigations & Forensic Dossiers**

   - Case management supporting triage statuses: `New`, `In Progress`, `Needs Review`, `Resolved`.
   - Epistemic separation of *Observed Verifiable Facts* from *Investigative Hypotheses*.
   - Interactive analyst notes with category tags (`OBSERVED_FACT`, `HYPOTHESIS`, `CORRELATION`, `CONCLUSION`).
   - Evidentiary limitations & confidence score gauge.
   - Export official `.md` Forensic Dossier button.

5. **Interactive Attack Graph**

   - Grounded entity-relationship graph (100 nodes, 2,184 edges).
   - Radial clustered topology: core domain controllers and databases at center, identities and workstations in perimeter orbits.
   - Edge inspector displaying verified protocol, port, byte count, timestamp, and evidence event ID.
   - Zoom, pan, reset view, node search, and entity-type filtering.

6. **Security Events Explorer**

   - Searchable, paginated event log table (2,231 verified security events).
   - Server-side offset pagination (40 events/page).
   - Filtration by Event Type (`AUTH_SUCCESS`, `AUTH_FAILURE`, `PROCESS_SPAWN`, `LATERAL_MOVEMENT`, `DATA_EXFILTRATION`, `NETWORK_CONNECTION`, `DNS_QUERY`).
   - Telemetry inspector drawer displaying raw event JSON.
   - Export filtered events to CSV.

7. **Analytics & Scientific Metrics**

   - Model benchmark telemetry: Isolation Forest contamination (0.15), 100 trees, Z-score threshold (2.5 &sigma;), execution duration (0.48s).
   - Feature-level statistical shift magnitude bar chart.
   - Entity risk score distribution density.
   - MITRE ATT&CK tactic coverage summary.

8. **Data Sources & Schema Validator**

   - Telemetry dataset registry: Active SIEM CSV (345 KB), PySpark Processed Parquet (124 KB), LANL Benchmark Corpus (24.8 MB).
   - Interactive Ingestion Schema Validator: live testing of CSV/JSON logs against mandatory fields and timestamp constraints.

9. **Methodology & Architecture**

   - End-to-end documentation of 8 pipeline stages.
   - Interactive architecture diagram.
   - Technical explanations of baseline construction, entropy formulas, and anti-hallucination safeguards.

10. **Settings & Portfolio Attribution**

    - API endpoint configuration and live `/health` connection test.
    - Tuning for Z-score threshold (2.0 &sigma;, 2.5 &sigma;, 3.0 &sigma;) and Isolation Forest contamination (0.05 to 0.20).
    - Minimum baseline event requirement configuration.
    - Master's in Cybersecurity project declaration.

---
## 5. Folder Structure

```
CyberDNA/
├── analytics/                          # Python Big Data & ML Pipeline
│   ├── cyberdna_pipeline/              # Core analytical modules
│   │   ├── __init__.py
│   │   ├── schema_validation.py        # Telemetry schema constraints
│   │   ├── data_cleaning.py            # Normalization & temporal synthesis
│   │   ├── feature_engineering.py      # Shannon entropy & diversity vectors
│   │   ├── baseline_engine.py          # Parametric/non-parametric baselines
│   │   ├── anomaly_detector.py         # Scikit-Learn IsolationForest engine
│   │   ├── correlation_engine.py       # MITRE ATT&CK tactic reconstruction
│   │   ├── graph_generator.py          # Grounded entity relationship graph
│   │   ├── generate_dataset.py         # Realistic enterprise security generator
│   │   └── cli.py                      # Pipeline command-line orchestrator
│   ├── datasets/
│   │   └── sample_security_events.csv  # 2,231 verified security event records
│   ├── output/
│   │   ├── pipeline_results.json       # Synthesized analytical store
│   │   └── processed_security_events.parquet # Parquet columnar storage
│   ├── tests/
│   │   └── test_analytics.py           # 8 automated unit tests (100% passing)
│   └── requirements.txt                # Python dependencies
│
├── backend/                            # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── models/
│   │   │   └── types.ts                # Shared TypeScript models
│   │   ├── routes/
│   │   │   └── api.ts                  # REST API endpoints
│   │   ├── services/
│   │   │   └── store.ts                # In-memory store + Parquet/JSON sync
│   │   └── server.ts                   # Express server entrypoint
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example                    # Backend environment template
│
├── frontend/                           # React 19 + TypeScript + Vite + Tailwind
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── CinematicLoader.tsx     # Loading screen
│   │   │   ├── CyberDNALogo.tsx        # CyberDNA logo
│   │   │   ├── Sidebar.tsx             # Dark forensic navigation
│   │   │   └── TopBar.tsx              # Breadcrumbs, search & sync trigger
│   │   ├── views/
│   │   │   ├── PublicHomeView.tsx      # Public homepage (/)
│   │   │   ├── LoginView.tsx           # Login page (/login)
│   │   │   ├── OverviewView.tsx        # Dashboard, velocity & risk metrics
│   │   │   ├── EntityDNAView.tsx       # Entity explorer & fingerprint drawer
│   │   │   ├── FindingsView.tsx        # Security alerts / findings review
│   │   │   ├── InvestigationsView.tsx  # Case dossiers & evidence notes
│   │   │   ├── AttackGraphView.tsx     # Grounded SVG relationship graph
│   │   │   ├── SecurityEventsView.tsx  # Paginated event log table
│   │   │   ├── AnalyticsView.tsx       # Hyperparameter & Z-score metrics
│   │   │   ├── DataSourcesView.tsx     # Datasets & schema validator
│   │   │   ├── MethodologyView.tsx     # Mathematical formulation & stages
│   │   │   └── SettingsView.tsx        # Threshold tuning & health status
│   │   ├── services/
│   │   │   └── api.ts                  # Typed API client
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx                     # Main router & state manager
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css                   # Custom scrollbars & typography
│   ├── index.html                      # Inter & Manrope Google Fonts
│   ├── tailwind.config.js              # Dark forensic palette with gold accent (#F2D35E)
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example                        # Root environment template
├── package.json                        # Root workspace scripts
└── README.md                           # Master documentation
```

---

## 6. Installation & Prerequisites

### Prerequisites

- **Node.js**: v20.0.0 or higher (v22.17.0 recommended)
- **npm**: v10.0.0 or higher
- **Python**: v3.10 to v3.13 (Python 3.13 tested)

### Step 1: Clone and Install Workspace Dependencies

```bash
git clone https://github.com/monishkacha/CyberDNA.git
cd CyberDNA

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend

# Install root orchestrator
npm install
```

> **Windows / PowerShell note:** if PowerShell blocks `npm.ps1` with an execution-policy error, use `npm.cmd install ...` instead, or run the commands from Command Prompt.

### Step 2: Install Python Analytics Dependencies

```bash
pip install -r analytics/requirements.txt
```

*(Dependencies: `pandas>=2.0.0`, `numpy>=1.24.0`, `scipy>=1.10.0`, `scikit-learn>=1.3.0`, `pyarrow>=14.0.0`)*

---

## 7. Development Commands

### Run Everything Concurrently

To run both backend API (port 3001) and frontend dev server (port 5173):

```bash
npm run dev
```

### Run Services Individually

- **Backend API**:

  ```bash
  npm run dev:backend
  # Server listens at http://localhost:3001
  ```

- **Frontend App**:

  ```bash
  npm run dev:frontend
  # Web app available at http://localhost:5173
  ```

- **Execute Python Analytics Pipeline**:

  ```bash
  npm run run:pipeline
  # Runs feature extraction, baselines, Isolation Forest, and exports Parquet/JSON
  ```

- **Run Python Unit Tests**:

  ```bash
  npm run test:pipeline
  # Executes all 8 test suites in analytics/tests/
  ```

- **Production Build (Both)**:

  ```bash
  npm run build
  ```

---

## 8. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | System health check and uptime status |
| `GET` | `/api/stats/overview` | Summary counts, velocity trends, severity distribution |
| `GET` | `/api/entities` | List profiled entities with filters (`type`, `anomalous`, `search`) |
| `GET` | `/api/entities/:id` | Entity detail and full behavioral fingerprint profile |
| `GET` | `/api/employees` | Same as `/api/entities` — employee list with filters (`department`, `anomalous`, `search`) |
| `GET` | `/api/employees/:id` | Employee detail, behavioral profile, and related findings |
| `GET` | `/api/devices` | List enterprise fleet devices |
| `GET` | `/api/devices/:id` | Single device detail |
| `GET` | `/api/findings` | List security findings with filters (`employeeId`, `category`, `reviewStatus`) |
| `GET` | `/api/findings/:id` | Finding detail with supporting telemetry events |
| `PATCH` | `/api/findings/:id/status` | Update finding review status (`NEW`, `UNDER_REVIEW`, `ESCALATED`, `BENIGN`, `RESOLVED`) |
| `GET` | `/api/events` | Paginated security events (`offset`, `limit`, `eventType`, `severity`) |
| `GET` | `/api/investigations` | All forensic investigations |
| `GET` | `/api/investigations/:id` | Case dossier with evidence, facts, hypotheses, and notes |
| `POST` | `/api/investigations` | Create new forensic investigation |
| `POST` | `/api/investigations/:id/notes` | Append categorized analyst note (`OBSERVED_FACT`, `HYPOTHESIS`, etc.) |
| `PATCH` | `/api/investigations/:id/status` | Update case status (`New`, `In Progress`, `Needs Review`, `Resolved`) |
| `GET` | `/api/investigations/:id/export` | Download formal `.md` investigation report dossier |
| `GET` | `/api/graph` | Grounded entity-relationship nodes and evidence edges |
| `GET` | `/api/analytics` | Statistical shifts, risk distribution, model benchmarks |
| `GET` | `/api/datasources` | Telemetry dataset metadata and validation statuses |
| `POST` | `/api/pipeline/run` | Trigger analytics pipeline re-synchronization |

---

## 9. Current Implementation Status

### Implemented Features

- [x] **Dark Forensic Design System**: Dark dashboard theme (`#0A0A0A`, `#111111`, `#171717`, `#292929`) with gold accent (`#F2D35E`) and muted text (`#D8D8D8`, `#A0A0A0`); the public homepage keeps an editorial, institutional style.
- [x] **Big Data Python Pipeline**:
  - [x] Strict schema validation module (`schema_validation.py`).
  - [x] Data cleaning and temporal variable extraction (`data_cleaning.py`).
  - [x] Multivariate feature engineering including Shannon Entropy (`feature_engineering.py`).
  - [x] Mathematical baseline engine with Z-scores and Modified MAD bounds (`baseline_engine.py`).
  - [x] Unsupervised Isolation Forest (100 estimators) anomaly detector (`anomaly_detector.py`).
  - [x] MITRE ATT&CK tactic progression correlation engine (`correlation_engine.py`).
  - [x] Evidence-backed relationship graph generator (`graph_generator.py`).
  - [x] Parquet columnar storage export (`processed_security_events.parquet`).
  - [x] 8 passing unit tests covering baseline safeguards and Isolation Forest math.
- [x] **Backend REST API**:
  - [x] Express + TypeScript architecture with full CRUD and pagination.
  - [x] In-memory datastore with automatic sync to pipeline artifacts.
  - [x] Formal Markdown forensic report exporter.
- [x] **React 19 Frontend**:
  - [x] Persistent sidebar with all 10 dashboard views.
  - [x] Topbar with live telemetry status and global search router.
  - [x] Overview dashboard with Recharts volume velocities and risk distribution.
  - [x] Entity DNA explorer with 24-hour activity histograms and Z-score tables.
  - [x] Security Alerts / Findings view with category and review-status filtering, anomaly scores, MITRE tactics, and supporting events.
  - [x] Investigation workspace with notes logger and hypothesis separation.
  - [x] Interactive SVG attack graph with zoom/pan and edge evidence inspector.
  - [x] Paginated security events table with CSV export.
  - [x] Analytics view with real pipeline execution benchmarks.
  - [x] Data sources registry and interactive schema validation sandbox.
  - [x] Methodology documentation and interactive architecture diagram.
  - [x] Settings view with threshold controls and live `/health` ping.

### Planned Extensions

- [ ] Distributed PySpark cluster submission script for datasets exceeding 100M rows.
- [ ] Live WebSocket streaming for real-time NetFlow ingestion.
- [ ] Direct MongoDB persistence replica set connection for multi-tenant deployments.

---

## 10. Evidentiary Principles & Limitations

1. **Statistical Deviation is Context-Dependent**: An elevated Z-score indicates behavioral departure from observed history, not verified compromise. 
Operational anomalies (e.g., scheduled maintenance, software updates) can produce high BDI scores.
2. **Telemetry Horizon Limitations**: Without host endpoint memory forensics, in-memory process injection cannot be definitively verified from network socket 
logs alone.
3. **Payload Inspection**: Encrypted TLS connections conceal application layer payloads; volume and frequency heuristics must be corroborated with endpoint 
audit logs.

---

## 11. Academic Attribution

Developed as an advanced Master's in Cybersecurity research project.

- **Platform**: CyberDNA — Behavioral Fingerprinting & Digital Forensics Platform
- **Tagline**: *"Understand behavior. Uncover what changed."*
- **Author**: Monish (Master's in Cybersecurity Candidate)
- **Year**: 2026
