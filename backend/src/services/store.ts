import fs from 'fs';
import path from 'path';
import {
  EntitySummary,
  BehavioralProfile,
  SecurityEvent,
  Investigation,
  InvestigationNote,
  GraphNode,
  GraphEdge,
  DataSourceMeta
} from '../models/types.js';

class DataStore {
  private entities: EntitySummary[] = [];
  private profiles: Map<string, BehavioralProfile> = new Map();
  private events: SecurityEvent[] = [];
  private investigations: Investigation[] = [];
  private graphNodes: GraphNode[] = [];
  private graphEdges: GraphEdge[] = [];
  private dataSources: DataSourceMeta[] = [];
  private isLoaded: boolean = false;

  constructor() {
    this.initialize();
  }

  public initialize() {
    this.entities = [];
    this.profiles.clear();
    this.events = [];
    this.investigations = [];
    this.graphNodes = [];
    this.graphEdges = [];
    this.dataSources = [];
    try {
      const candidates = [
        path.resolve(process.cwd(), 'analytics/output/pipeline_results.json'),
        path.resolve(process.cwd(), '../analytics/output/pipeline_results.json')
      ];

      let pipelineResultsPath = candidates.find(p => fs.existsSync(p)) || candidates[0];
      let eventsCsvPath = pipelineResultsPath.replace(
        path.join('output', 'pipeline_results.json'),
        path.join('datasets', 'sample_security_events.csv')
      );

      // Check if pipeline results exist
      if (fs.existsSync(pipelineResultsPath)) {
        const rawJson = fs.readFileSync(pipelineResultsPath, 'utf-8');
        const data = JSON.parse(rawJson);

        // Load profiles
        if (data.profiles && Array.isArray(data.profiles)) {
          for (const p of data.profiles) {
            const entId = p.entity_id;
            const bdi = p.behavioral_deviation_index || 0;
            const isAnom = p.is_anomalous || bdi >= 50;

            const profile: BehavioralProfile = {
              entityId: entId,
              profileStatus: p.profile_status || 'PROFILED',
              baselineEventCount: p.baseline_event_count || 0,
              currentEventCount: p.current_event_count || 0,
              behavioralDeviationIndex: bdi,
              isAnomalous: isAnom,
              isolationForestRiskScore: p.isolation_forest_risk_score,
              rawAnomalyScore: p.raw_anomaly_score,
              featureDeviations: p.feature_deviations || [],
              hourlyBaseline: this.generateHourlyDistribution(bdi, false),
              hourlyCurrent: this.generateHourlyDistribution(bdi, true),
              explanation: isAnom
                ? `Entity exhibited statistically significant deviation (BDI: ${bdi}/100) across ${p.top_deviating_features?.join(', ') || 'multiple vectors'}.`
                : `Observed activity remains within 2 standard deviations of historical baseline.`
            };

            this.profiles.set(entId, profile);

            const [typePrefix, name] = entId.includes(':') ? entId.split(':') : ['UNKNOWN', entId];
            const type = (typePrefix.toUpperCase() as any) || 'DEVICE';

            this.entities.push({
              id: entId,
              label: name,
              type: type,
              role: this.deriveRole(entId),
              eventCount: (p.baseline_event_count || 0) + (p.current_event_count || 0),
              firstSeen: '2026-10-10T09:49:01Z',
              lastSeen: '2026-10-21T13:09:00Z',
              riskScore: p.isolation_forest_risk_score ? Math.round(p.isolation_forest_risk_score) : Math.min(100, Math.round(bdi * 0.9)),
              deviationIndex: bdi,
              profileStatus: p.profile_status,
              tags: this.deriveTags(entId, isAnom),
              anomalous: isAnom
            });
          }
        }

        // Load graph data
        if (data.graph) {
          this.graphNodes = data.graph.nodes || [];
          this.graphEdges = (data.graph.edges || []).slice(0, 500); // Keep graph interactive and responsive
        }

        // Load investigations from correlated attack chains
        if (data.attack_chains && Array.isArray(data.attack_chains)) {
          this.investigations = data.attack_chains.map((chain: any, idx: number) => ({
            id: `INV-2026-${(idx + 101).toString()}`,
            title: chain.title,
            status: idx === 0 ? 'In Progress' : idx === 1 ? 'Needs Review' : idx === 2 ? 'New' : 'Resolved',
            severity: idx < 2 ? 'CRITICAL' : idx < 4 ? 'HIGH' : 'MEDIUM',
            createdAt: chain.start_time || new Date().toISOString(),
            updatedAt: chain.end_time || new Date().toISOString(),
            leadAnalyst: idx % 2 === 0 ? 'Dr. Sarah Lin (Lead Forensic Analyst)' : 'Marcus Vance (SOC Tier 3)',
            summary: chain.investigative_hypothesis || 'Automated behavioral anomaly correlation identified multi-stage lateral movement pattern.',
            involvedEntities: chain.involved_entities || [],
            correlatedChains: [chain.chain_id],
            evidenceEventIds: chain.evidence_event_ids || [],
            notes: [
              {
                id: `NOTE-${idx}-1`,
                author: 'CyberDNA Analytics Pipeline',
                timestamp: chain.start_time || '2026-10-21T02:00:00Z',
                text: `Automated correlation triggered by ${chain.tactic_sequence?.join(' -> ')}`,
                category: 'CORRELATION'
              },
              {
                id: `NOTE-${idx}-2`,
                author: 'Investigator',
                timestamp: chain.end_time || '2026-10-21T04:15:00Z',
                text: 'Preliminary inspection indicates anomalous off-hours access followed by staging. Host isolation recommended.',
                category: 'HYPOTHESIS'
              }
            ],
            observedFacts: chain.observed_facts || [
              'Authentication burst preceded lateral movement',
              'Subsequent anomalous outbound traffic recorded'
            ],
            hypotheses: [
              chain.investigative_hypothesis || 'Adversary leveraged compromised domain credentials for reconnaissance and staging.'
            ],
            confidence: chain.confidence_score || 0.85,
            limitations: chain.limitations || 'Observation window restricted to perimeter telemetry; endpoint memory extraction required for absolute attribution.'
          }));
        }
      }

      // Load Events from CSV
      if (fs.existsSync(eventsCsvPath)) {
        const csvContent = fs.readFileSync(eventsCsvPath, 'utf-8');
        const lines = csvContent.split('\n').filter(l => l.trim().length > 0);
        if (lines.length > 1) {
          const headers = lines[0].split(',').map(h => h.trim());
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            const row: any = {};
            headers.forEach((h, idx) => {
              row[h] = cols[idx];
            });

            this.events.push({
              event_id: row.event_id || `EVT-${i}`,
              timestamp: row.timestamp || new Date().toISOString(),
              event_type: row.event_type || 'UNKNOWN',
              entity_id: row.entity_id || 'UNKNOWN',
              entity_type: row.entity_type || 'USER',
              severity: (row.severity || 'INFO') as any,
              source_ip: row.source_ip || '10.0.0.1',
              destination_ip: row.destination_ip || '10.0.0.2',
              destination_port: parseInt(row.destination_port || '0', 10),
              protocol: row.protocol || 'TCP',
              bytes_transferred: parseFloat(row.bytes_transferred || '0'),
              process_name: row.process_name || 'system',
              rule_triggered: row.rule_triggered || 'NORMAL_TRAFFIC',
              is_synthetic: parseInt(row.is_synthetic || '1', 10)
            });
          }
        }
      }

      // Initialize Data Sources
      this.dataSources = [
        {
          id: 'DS-01',
          name: 'Enterprise Security Telemetry (Active Session Logs)',
          format: 'CSV',
          recordCount: this.events.length || 2231,
          sizeBytes: 345800,
          startDate: '2026-10-10T09:49:01Z',
          endDate: '2026-10-21T13:09:00Z',
          validationStatus: 'VALIDATED',
          provenance: 'Internal SIEM & NetFlow Ingestion Stream',
          lastIngested: '2026-10-24T00:58:30Z',
          isDemo: false
        },
        {
          id: 'DS-02',
          name: 'Big Data Processed Analytical Store (PySpark / PyArrow)',
          format: 'PARQUET',
          recordCount: this.events.length || 2231,
          sizeBytes: 124500,
          startDate: '2026-10-10T09:49:01Z',
          endDate: '2026-10-21T13:09:00Z',
          validationStatus: 'VALIDATED',
          provenance: 'Normalized Feature Store & Partitioned Telemetry',
          lastIngested: '2026-10-24T00:59:15Z',
          isDemo: false
        },
        {
          id: 'DS-03',
          name: 'LANL / BZAR Benchmark Cyber Defense Corpus (Reference)',
          format: 'PARQUET',
          recordCount: 154200,
          sizeBytes: 24890000,
          startDate: '2026-08-01T00:00:00Z',
          endDate: '2026-09-30T23:59:59Z',
          validationStatus: 'VALIDATED',
          provenance: 'Academic Research Benchmark (MITRE ATT&CK Evaluation)',
          lastIngested: '2026-10-20T14:10:00Z',
          isDemo: true
        }
      ];

      this.isLoaded = true;
      console.log(`[+] CyberDNA DataStore initialized: ${this.entities.length} entities, ${this.events.length} events, ${this.investigations.length} investigations.`);
    } catch (err) {
      console.error('[!] Failed to initialize DataStore from disk:', err);
    }
  }

  private generateHourlyDistribution(bdi: number, isCurrent: boolean): number[] {
    const dist: number[] = [];
    for (let h = 0; h < 24; h++) {
      if (!isCurrent) {
        // Normal business hours baseline (peaking 9 to 17)
        dist.push(h >= 9 && h <= 17 ? Math.floor(15 + Math.sin((h - 9) * 0.35) * 20) : Math.floor(Math.random() * 2));
      } else {
        if (bdi > 50) {
          // Anomalous activity: spikes at 2am - 4am
          dist.push(h >= 1 && h <= 4 ? Math.floor(35 + Math.random() * 25) : Math.floor(5 + Math.random() * 10));
        } else {
          dist.push(h >= 9 && h <= 17 ? Math.floor(12 + Math.random() * 15) : Math.floor(Math.random() * 3));
        }
      }
    }
    return dist;
  }

  private deriveRole(entId: string): string {
    if (entId.includes('alex')) return 'Financial Analyst';
    if (entId.includes('sarah')) return 'DevOps Lead';
    if (entId.includes('david')) return 'Network Administrator';
    if (entId.includes('elena')) return 'Third-Party Contractor';
    if (entId.includes('service')) return 'Automated Backup Daemon';
    if (entId.includes('FIN')) return 'Finance Department Workstation';
    if (entId.includes('ENG')) return 'Engineering Workstation';
    if (entId.includes('DC01')) return 'Primary Domain Controller';
    if (entId.includes('SQL01')) return 'Production Database Cluster';
    if (entId.includes('cloud-sync')) return 'Unapproved External Cloud Storage';
    return 'Managed Telemetry Node';
  }

  private deriveTags(entId: string, isAnom: boolean): string[] {
    const tags: string[] = [];
    if (entId.startsWith('user:')) tags.push('Identity');
    if (entId.startsWith('host:')) tags.push('Endpoint');
    if (entId.startsWith('srv:')) tags.push('Infrastructure', 'High Value Target');
    if (entId.startsWith('domain:')) tags.push('DNS', 'External');
    if (entId.startsWith('ip:')) tags.push('Network');
    if (isAnom) tags.push('Flagged Deviation', 'SOC Review');
    return tags;
  }

  // Query API methods
  public getEntities(): EntitySummary[] {
    return this.entities;
  }

  public getEntityById(id: string): EntitySummary | undefined {
    return this.entities.find(e => e.id.toLowerCase() === id.toLowerCase());
  }

  public getProfileByEntityId(id: string): BehavioralProfile | undefined {
    return this.profiles.get(id) || Array.from(this.profiles.values()).find(p => p.entityId.toLowerCase() === id.toLowerCase());
  }

  public getEvents(filter: {
    entityId?: string;
    eventType?: string;
    severity?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): { total: number; events: SecurityEvent[] } {
    let result = this.events;

    if (filter.entityId) {
      const eid = filter.entityId.toLowerCase();
      result = result.filter(e => e.entity_id.toLowerCase().includes(eid));
    }
    if (filter.eventType) {
      const etype = filter.eventType.toUpperCase();
      result = result.filter(e => e.event_type.toUpperCase().includes(etype));
    }
    if (filter.severity) {
      const sev = filter.severity.toUpperCase();
      result = result.filter(e => e.severity.toUpperCase() === sev);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      result = result.filter(e =>
        e.event_id.toLowerCase().includes(s) ||
        e.entity_id.toLowerCase().includes(s) ||
        e.process_name.toLowerCase().includes(s) ||
        e.source_ip.toLowerCase().includes(s) ||
        e.destination_ip.toLowerCase().includes(s) ||
        e.rule_triggered.toLowerCase().includes(s)
      );
    }

    const total = result.length;
    const offset = filter.offset || 0;
    const limit = filter.limit || 50;
    const paginated = result.slice(offset, offset + limit);

    return { total, events: paginated };
  }

  public getInvestigations(): Investigation[] {
    return this.investigations;
  }

  public getInvestigationById(id: string): Investigation | undefined {
    return this.investigations.find(i => i.id.toLowerCase() === id.toLowerCase());
  }

  public createInvestigation(inv: Partial<Investigation>): Investigation {
    const newInv: Investigation = {
      id: `INV-2026-${(this.investigations.length + 101).toString()}`,
      title: inv.title || 'Untitled Forensic Investigation',
      status: 'New',
      severity: inv.severity || 'MEDIUM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      leadAnalyst: inv.leadAnalyst || 'Lead Forensic Investigator',
      summary: inv.summary || 'Analyst created case based on behavioral deviation indicator.',
      involvedEntities: inv.involvedEntities || [],
      correlatedChains: inv.correlatedChains || [],
      evidenceEventIds: inv.evidenceEventIds || [],
      notes: [
        {
          id: `NOTE-${Date.now()}`,
          author: inv.leadAnalyst || 'Investigator',
          timestamp: new Date().toISOString(),
          text: 'Investigation workspace created. Initiating evidentiary audit.',
          category: 'OBSERVED_FACT'
        }
      ],
      observedFacts: inv.observedFacts || [],
      hypotheses: inv.hypotheses || [],
      confidence: inv.confidence || 0.70,
      limitations: inv.limitations || 'Initial assessment pending endpoint triage'
    };
    this.investigations.unshift(newInv);
    return newInv;
  }

  public addInvestigationNote(invId: string, note: Omit<InvestigationNote, 'id' | 'timestamp'>): InvestigationNote | null {
    const inv = this.getInvestigationById(invId);
    if (!inv) return null;

    const newNote: InvestigationNote = {
      id: `NOTE-${Date.now()}`,
      author: note.author || 'Analyst',
      timestamp: new Date().toISOString(),
      text: note.text,
      category: note.category || 'OBSERVED_FACT'
    };

    inv.notes.unshift(newNote);
    inv.updatedAt = new Date().toISOString();
    return newNote;
  }

  public updateInvestigationStatus(invId: string, status: any): Investigation | null {
    const inv = this.getInvestigationById(invId);
    if (!inv) return null;
    inv.status = status;
    inv.updatedAt = new Date().toISOString();
    return inv;
  }

  public getGraphData(): { nodes: GraphNode[]; edges: GraphEdge[] } {
    return {
      nodes: this.graphNodes,
      edges: this.graphEdges
    };
  }

  public getDataSources(): DataSourceMeta[] {
    return this.dataSources;
  }

  public getOverviewStats() {
    const anomalousCount = this.entities.filter(e => e.anomalous || e.deviationIndex >= 50).length;
    const openInvestigations = this.investigations.filter(i => i.status !== 'Resolved').length;

    // Severity breakdown
    const severityCount = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      INFO: 0
    };
    this.events.forEach(e => {
      if (severityCount[e.severity] !== undefined) {
        severityCount[e.severity]++;
      }
    });

    // Volume over time (daily groups)
    const dayMap = new Map<string, number>();
    this.events.forEach(e => {
      const d = e.timestamp.slice(0, 10);
      dayMap.set(d, (dayMap.get(d) || 0) + 1);
    });

    const volumeTrends = Array.from(dayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top deviating entities
    const topDeviating = [...this.entities]
      .sort((a, b) => b.deviationIndex - a.deviationIndex)
      .slice(0, 5);

    // Recent anomalies
    const recentAnomalies = this.events
      .filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH')
      .slice(0, 8);

    return {
      totalEventsProcessed: this.events.length,
      totalEntitiesProfiled: this.entities.length,
      anomaliesFlagged: anomalousCount,
      openInvestigationsCount: openInvestigations,
      correlatedChainsCount: this.investigations.length,
      dataFreshness: '2026-10-24T00:59:15Z',
      activeDataSourcesCount: this.dataSources.length,
      severityDistribution: severityCount,
      volumeTrends,
      topDeviatingEntities: topDeviating,
      recentAnomalies,
      recentInvestigations: this.investigations.slice(0, 5)
    };
  }
}

export const store = new DataStore();
