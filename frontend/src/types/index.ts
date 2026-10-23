export type EntityType = 'USER' | 'DEVICE' | 'IP' | 'SERVER' | 'DOMAIN';
export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type InvestigationStatus = 'New' | 'In Progress' | 'Needs Review' | 'Resolved';

export interface EntitySummary {
  id: string;
  label: string;
  type: EntityType;
  role: string;
  eventCount: number;
  firstSeen: string;
  lastSeen: string;
  riskScore: number;
  deviationIndex: number;
  profileStatus: 'PROFILED' | 'INSUFFICIENT_HISTORY' | 'PENDING_BASELINE';
  tags: string[];
  anomalous: boolean;
}

export interface FeatureDeviation {
  feature: string;
  baseline_value: number;
  current_value: number;
  absolute_shift: number;
  percentage_change: number;
  z_score: number;
  severity: 'NORMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
  weight: number;
}

export interface BehavioralProfile {
  entityId: string;
  profileStatus: 'PROFILED' | 'INSUFFICIENT_HISTORY' | 'PENDING_BASELINE';
  baselineEventCount: number;
  currentEventCount: number;
  behavioralDeviationIndex: number;
  isAnomalous: boolean;
  isolationForestRiskScore?: number;
  rawAnomalyScore?: number;
  featureDeviations: FeatureDeviation[];
  hourlyBaseline: number[];
  hourlyCurrent: number[];
  explanation: string;
}

export interface SecurityEvent {
  event_id: string;
  timestamp: string;
  event_type: string;
  entity_id: string;
  entity_type: EntityType;
  severity: Severity;
  source_ip: string;
  destination_ip: string;
  destination_port: number;
  protocol: string;
  bytes_transferred: number;
  process_name: string;
  rule_triggered: string;
  is_synthetic: number;
}

export interface InvestigationNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
  category: 'OBSERVED_FACT' | 'HYPOTHESIS' | 'CORRELATION' | 'CONCLUSION';
}

export interface Investigation {
  id: string;
  title: string;
  status: InvestigationStatus;
  severity: Severity;
  createdAt: string;
  updatedAt: string;
  leadAnalyst: string;
  summary: string;
  involvedEntities: string[];
  correlatedChains: string[];
  evidenceEventIds: string[];
  notes: InvestigationNote[];
  observedFacts: string[];
  hypotheses: string[];
  confidence: number;
  limitations: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  event_count: number;
  risk_level: Severity;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  event_type: string;
  timestamp: string;
  evidence_event_id: string;
  port?: number;
  bytes?: number;
  protocol?: string;
}

export interface DataSourceMeta {
  id: string;
  name: string;
  format: 'CSV' | 'JSON' | 'PARQUET';
  recordCount: number;
  sizeBytes: number;
  startDate: string;
  endDate: string;
  validationStatus: 'VALIDATED' | 'VALIDATION_WARNING' | 'FAILED';
  provenance: string;
  lastIngested: string;
  isDemo: boolean;
}
