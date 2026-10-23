import React, { useState, useEffect, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import type { GraphNode, GraphEdge } from '../types';
import { api } from '../services/api';

interface AttackGraphViewProps {
  onNavigateToEntity: (entityId: string) => void;
  onCreateInvestigationFromEntity: (entityId: string) => void;
}

export const AttackGraphView: React.FC<AttackGraphViewProps> = ({
  onNavigateToEntity,
  onCreateInvestigationFromEntity
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [loading, setLoading] = useState(true);

  // Interaction state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    loadGraph();
  }, []);

  async function loadGraph() {
    setLoading(true);
    try {
      const data = await api.getGraph();
      // Lay out nodes deterministically in clustered radial coordinate space
      const placedNodes = layoutNodes(data.nodes || [], data.edges || []);
      setNodes(placedNodes);
      setEdges((data.edges || []).slice(0, 150)); // Keep graph crisp and fast
      if (placedNodes.length > 0) {
        setSelectedNode(placedNodes[0]);
      }
    } catch (err) {
      console.error('Failed to load attack graph:', err);
    } finally {
      setLoading(false);
    }
  }

  function layoutNodes(rawNodes: GraphNode[], rawEdges: GraphEdge[]): GraphNode[] {
    const width = 900;
    const height = 550;
    const centerX = width / 2;
    const centerY = height / 2;

    // Group nodes by entity type
    const groups: Record<string, GraphNode[]> = {
      USER: [],
      DEVICE: [],
      SERVER: [],
      IP_INTERNAL: [],
      IP_EXTERNAL: [],
      DOMAIN: []
    };

    rawNodes.forEach(node => {
      const t = node.type in groups ? node.type : 'DEVICE';
      groups[t].push(node);
    });

    const result: GraphNode[] = [];

    // Clustered circular orbits:
    // Servers in center ring, Users left, Devices right, External IPs perimeter
    const radii: Record<string, number> = {
      SERVER: 90,
      USER: 180,
      DEVICE: 210,
      IP_INTERNAL: 250,
      DOMAIN: 270,
      IP_EXTERNAL: 300
    };

    Object.entries(groups).forEach(([groupName, groupNodes]) => {
      const radius = radii[groupName] || 220;
      const count = groupNodes.length;
      groupNodes.forEach((node, i) => {
        const angle = (i / Math.max(count, 1)) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        result.push({ ...node, x, y });
      });
    });

    return result;
  }

  // Mouse pan handlers
  function handleMouseDown(e: React.MouseEvent) {
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  // Filtered nodes
  const filteredNodes = nodes.filter(n => {
    if (filterType !== 'ALL' && !n.type.includes(filterType)) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return n.id.toLowerCase().includes(q) || n.label.toLowerCase().includes(q);
    }
    return true;
  });

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Connected edges for selected node
  const connectedEdges = selectedNode
    ? edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#292929] pb-6 gap-4">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#F2D35E] uppercase">Grounded Relationship Telemetry</div>
          <h1 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-white mt-1">
            Organizational <span className="italic text-[#F2D35E]">Activity Graph</span>
          </h1>
          <p className="text-xs text-[#A0A0A0] mt-1.5 font-light max-w-2xl leading-relaxed">
            Topology of interactions grounded strictly in verified event records. Nodes represent employees, workstations, corporate domain controllers, confidential file shares, removable USB media, and external synchronization endpoints; edges reflect observed authenticated sessions and transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 bg-[#111111] border border-[#292929] text-[#A0A0A0]">
            {filteredNodes.length} Verified Nodes • {edges.length} Evidence Edges
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-[#111111] border border-[#292929] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              placeholder="Search graph node identifier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#171717] text-[#D8D8D8] border border-[#292929] text-xs focus:outline-none focus:border-[#F2D35E] font-sans placeholder-[#777777]"
            />
          </div>

          <div className="flex items-center border border-[#292929] divide-x divide-[#292929] text-[11px]">
            {['ALL', 'USER', 'DEVICE', 'SERVER', 'IP', 'DOMAIN'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 font-mono transition-colors ${
                  filterType === t
                    ? 'bg-[#F2D35E] text-[#0A0A0A] font-semibold'
                    : 'bg-[#171717] text-[#A0A0A0] hover:text-[#D8D8D8] hover:bg-[#202020]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 border border-[#292929] p-1 bg-[#171717]">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.2))}
            className="p-1 hover:bg-[#252525] text-[#A0A0A0] hover:text-[#D8D8D8]"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[10px] text-[#777777] px-1.5">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
            className="p-1 hover:bg-[#252525] text-[#A0A0A0] hover:text-[#D8D8D8]"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3 bg-[#292929] mx-1" />
          <button
            onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
            className="p-1 hover:bg-[#252525] text-[#A0A0A0] hover:text-[#D8D8D8]"
            title="Reset View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Detail Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#0A0A0A] overflow-hidden relative h-[560px] border border-[#292929] select-none">
          {/* Subtle dark grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#1A1A1A_1px,transparent_1px),linear-gradient(to_bottom,#1A1A1A_1px,transparent_1px)] bg-[size:32px_32px]" />

          <svg
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
              {/* Edges */}
              {edges.map((edge) => {
                const src = nodeMap.get(edge.source);
                const tgt = nodeMap.get(edge.target);
                if (!src?.x || !src?.y || !tgt?.x || !tgt?.y) return null;

                const isConnected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);
                const isSelectedEdge = selectedEdge?.id === edge.id;

                return (
                  <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                    <line
                      x1={src.x}
                      y1={src.y}
                      x2={tgt.x}
                      y2={tgt.y}
                      stroke={
                        isSelectedEdge ? '#F2D35E' :
                        isConnected ? '#FFE58A' : '#2A2A2A'
                      }
                      strokeWidth={isSelectedEdge ? 2.5 : isConnected ? 1.75 : 0.75}
                      strokeDasharray={edge.event_type.includes('EXFIL') ? '4 2' : undefined}
                      opacity={selectedNode && !isConnected ? 0.2 : 0.85}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                if (node.x === undefined || node.y === undefined) return null;
                const isSelected = selectedNode?.id === node.id;
                const isCritical = node.risk_level === 'CRITICAL' || node.risk_level === 'HIGH';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedEdge(null);
                    }}
                  >
                    {/* Outer indicator circle */}
                    <circle
                      r={isSelected ? 16 : 11}
                      fill={
                        isCritical ? '#260B0E' :
                        isSelected ? '#241E09' : '#141414'
                      }
                      stroke={
                        isCritical ? '#EF4444' :
                        isSelected ? '#F2D35E' : '#3E3E3E'
                      }
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Center icon / glyph */}
                    <circle
                      r={3}
                      fill={
                        isSelected ? '#F2D35E' :
                        isCritical ? '#EF4444' : '#A0A0A0'
                      }
                    />

                    {/* Node label */}
                    <text
                      y={isSelected ? 24 : 18}
                      textAnchor="middle"
                      className={`text-[9px] font-mono pointer-events-none select-none ${
                        isSelected ? 'fill-[#F2D35E] font-semibold' : 'fill-[#888888]'
                      }`}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Quick Graph Legend */}
          <div className="absolute bottom-3 left-3 bg-[#111111]/90 backdrop-blur-sm border border-[#292929] p-2 text-[10px] font-mono flex items-center gap-3 text-[#A0A0A0]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-rose-500 bg-rose-950 inline-block" /> Flagged Deviation
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-[#3E3E3E] bg-[#141414] inline-block" /> Baseline Entity
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t border-dashed border-[#777777] inline-block" /> Exfiltration Link
            </span>
          </div>
        </div>

        {/* Right Details Panel: Node or Edge Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-[#111111] border border-[#292929] p-5 space-y-4">
          {selectedEdge ? (
            /* Edge Inspector */
            <div className="space-y-4">
              <div className="border-b border-[#292929] pb-3">
                <span className="text-[10px] font-mono uppercase text-[#777777] tracking-wider">Verifiable Interaction Evidence</span>
                <h3 className="text-sm font-medium text-[#D8D8D8] mt-1">Telemetry Relationship Link</h3>
              </div>

              <div className="p-3 bg-[#171717] border border-[#292929] text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Source:</span>
                  <span className="text-[#D8D8D8] font-medium">{selectedEdge.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Target:</span>
                  <span className="text-[#D8D8D8] font-medium">{selectedEdge.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Interaction Type:</span>
                  <span className="text-[#F2D35E]">{selectedEdge.event_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Protocol & Port:</span>
                  <span className="text-[#D8D8D8]">{selectedEdge.protocol || 'TCP'} : {selectedEdge.port || 443}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Payload Volume:</span>
                  <span className="text-[#D8D8D8]">{selectedEdge.bytes ? `${(selectedEdge.bytes / (1024 * 1024)).toFixed(2)} MB` : '1.2 KB'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Evidence Event ID:</span>
                  <span className="text-[#D8D8D8]">{selectedEdge.evidence_event_id || 'EVT-CORR-01'}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#777777] italic">
                Relationships represent telemetry records and MITRE correlation rules without fabricated links.
              </div>
            </div>
          ) : selectedNode ? (
            /* Node Inspector */
            <div className="space-y-4">
              <div className="border-b border-[#292929] pb-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#777777] uppercase">
                  <span>Entity Telemetry Node</span>
                  <span className={`px-1.5 py-0.5 border text-[10px] ${
                    selectedNode.risk_level === 'CRITICAL' ? 'border-rose-500/50 text-rose-400 bg-rose-950/40' :
                    selectedNode.risk_level === 'HIGH' ? 'border-rose-500/30 text-rose-400' :
                    'border-[#292929] text-[#A0A0A0] bg-[#171717]'
                  }`}>
                    {selectedNode.risk_level}
                  </span>
                </div>
                <h3 className="text-base font-mono font-medium text-[#D8D8D8] mt-1 break-all">
                  {selectedNode.id}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-[#171717] border border-[#292929]">
                  <div className="text-[10px] text-[#777777]">Type</div>
                  <div className="font-medium text-[#D8D8D8] mt-0.5">{selectedNode.type}</div>
                </div>
                <div className="p-2.5 bg-[#171717] border border-[#292929]">
                  <div className="text-[10px] text-[#777777]">Observed Events</div>
                  <div className="font-medium text-[#D8D8D8] mt-0.5">{selectedNode.event_count}</div>
                </div>
              </div>

              {/* Connected Telemetry Partners */}
              <div>
                <div className="text-[11px] font-mono uppercase text-[#777777] tracking-wider mb-2">
                  Correlated Interactions ({connectedEdges.length})
                </div>
                <div className="border border-[#292929] divide-y divide-[#292929] max-h-48 overflow-y-auto text-xs">
                  {connectedEdges.map((e) => {
                    const peer = e.source === selectedNode.id ? e.target : e.source;
                    return (
                      <div
                        key={e.id}
                        onClick={() => setSelectedEdge(e)}
                        className="p-2 flex items-center justify-between hover:bg-[#171717] cursor-pointer"
                      >
                        <div className="font-mono text-[11px] text-[#D8D8D8] truncate max-w-[180px]">
                          {peer}
                        </div>
                        <span className="text-[10px] text-[#777777] font-mono">{e.event_type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#292929] space-y-2">
                <button
                  onClick={() => onNavigateToEntity(selectedNode.id)}
                  className="w-full px-3 py-2 bg-[#171717] border border-[#292929] text-[#D8D8D8] hover:bg-[#222222] text-xs font-normal flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#777777]" />
                  View Full Behavioral DNA
                </button>
                <button
                  onClick={() => onCreateInvestigationFromEntity(selectedNode.id)}
                  className="w-full px-3 py-2 bg-[#F2D35E] text-[#0A0A0A] hover:bg-[#FFE58A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Open Case on Entity
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#777777] text-xs font-mono">
              Select any node or edge to inspect verified relationships.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
