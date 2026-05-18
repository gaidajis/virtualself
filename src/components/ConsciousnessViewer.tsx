import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Image, Video, Music, Brain,
  ChevronRight, ChevronDown, X, Download, Upload,
  Clock, MessageSquare, Zap, Shield, Lock,
  FileText, Database, Settings, User, GraduationCap, Code, Link, Activity, Star, Heart, Briefcase
} from 'lucide-react';
import * as d3 from 'd3-force';
import { useVirtualMe } from '@/store/useVirtualMe';
import type { ParisData } from '@/types';

interface ConsciousnessViewerProps {
  data: ParisData;
}

type NodeType = 'consciousness' | 'thought' | 'memory' | 'place' | 'person' | 
                'skill' | 'project' | 'goal' | 'health' | 'media' | 'connection';

interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  color: string;
  size: number;
  x: number;
  y: number;
  connections: string[];
  data?: unknown;
  mediaType?: 'photo' | 'video' | 'audio' | 'location' | 'text';
}

const KEY_ICONS: Record<string, React.ReactNode> = {
  profile: <User className="w-5 h-5" />,
  lifeTimeline: <Clock className="w-5 h-5" />,
  education: <GraduationCap className="w-5 h-5" />,
  workExperience: <Briefcase className="w-5 h-5" />,
  skills: <Code className="w-5 h-5" />,
  interestsAndValues: <Heart className="w-5 h-5" />,
  healthAndPerformance: <Activity className="w-5 h-5" />,
  relationships: <Link className="w-5 h-5" />,
  financeAndWorkstyle: <Settings className="w-5 h-5" />,
  projects: <Zap className="w-5 h-5" />,
  learningAndRoadmap: <Star className="w-5 h-5" />,
  personalityModel: <Brain className="w-5 h-5" />,
  memoryModel: <Database className="w-5 h-5" />,
  system: <Settings className="w-5 h-5" />,
  userId: <User className="w-5 h-5" />
};

const KEY_COLORS: Record<string, string> = {
  profile: 'from-blue-400 via-indigo-500 to-purple-500',
  lifeTimeline: 'from-purple-400 via-pink-500 to-rose-500',
  education: 'from-emerald-400 via-teal-500 to-cyan-500',
  workExperience: 'from-slate-400 via-gray-500 to-zinc-500',
  skills: 'from-cyan-400 via-blue-500 to-indigo-500',
  interestsAndValues: 'from-pink-400 via-rose-500 to-red-500',
  healthAndPerformance: 'from-red-400 via-orange-500 to-amber-500',
  relationships: 'from-rose-400 via-pink-500 to-purple-500',
  financeAndWorkstyle: 'from-emerald-500 via-green-600 to-teal-700',
  projects: 'from-amber-400 via-orange-500 to-red-500',
  learningAndRoadmap: 'from-yellow-400 via-amber-500 to-orange-500',
  personalityModel: 'from-indigo-400 via-purple-500 to-pink-500',
  memoryModel: 'from-blue-500 via-cyan-600 to-teal-500',
  system: 'from-gray-400 via-slate-500 to-zinc-600',
  userId: 'from-gray-500 via-gray-600 to-gray-700'
};

export function ConsciousnessViewer({ data }: ConsciousnessViewerProps) {
  const { isEditMode, toggleEditMode, exportData, importData, updateRawData } = useVirtualMe();
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editJsonStr, setEditJsonStr] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<NodeData[]>([]);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  // Generate initial nodes
  useEffect(() => {
    const nodeList: NodeData[] = [];

    nodeList.push({
      id: 'consciousness',
      type: 'consciousness',
      label: data.profile?.preferredName || data.profile?.fullName || 'VirtualMe',
      sublabel: 'Core Consciousness',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-cyan-400 via-blue-500 to-purple-600',
      size: 100,
      x: 0,
      y: 0,
      connections: [],
      mediaType: 'text'
    });

    const keys = Object.keys(data);

    keys.forEach((key) => {
      const val = data[key as keyof ParisData];
      let sublabel = '';
      if (Array.isArray(val)) {
        sublabel = `${val.length} items`;
      } else if (typeof val === 'object' && val !== null) {
        sublabel = `${Object.keys(val).length} sections`;
      }

      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      nodeList.push({
        id: key,
        type: 'thought',
        label: label,
        sublabel: sublabel,
        icon: KEY_ICONS[key] || <FileText className="w-5 h-5" />,
        color: KEY_COLORS[key] || 'from-slate-400 via-gray-500 to-zinc-500',
        size: 70,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400 - 200,
        connections: ['consciousness'],
        data: val,
        mediaType: 'text'
      });
    });

    // Run physics simulation
    const simulation = d3.forceSimulation(nodeList as any)
      .force('charge', d3.forceManyBody().strength(-2000))
      .force('collide', d3.forceCollide().radius((d: any) => d.size * 1.5))
      .force('center', d3.forceCenter(0, 0))
      .force('link', d3.forceLink().id((d: any) => d.id).distance(250).links(
        nodeList.slice(1).map(n => ({ source: n.id, target: 'consciousness' }))
      ));

    simulation.on('tick', () => {
      setNodes([...nodeList]);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

  useEffect(() => {
    setIsEditingNode(false);
    setEditJsonStr('');
  }, [selectedNode?.id]);

  // Handle pan drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.node-element')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleExport = () => {
    const jsonData = exportData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtualme-consciousness-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getMediaTypeColor = (mediaType?: string) => {
    switch (mediaType) {
      case 'photo': return 'from-pink-500 to-rose-500';
      case 'video': return 'from-purple-500 to-violet-500';
      case 'audio': return 'from-cyan-500 to-blue-500';
      case 'location': return 'from-green-500 to-emerald-500';
      case 'text': default: return 'from-slate-500 to-gray-500';
    }
  };

  return (
    <div className="relative w-full flex-1 overflow-hidden">
      {/* Control Panel */}
      <motion.div 
        className="absolute top-4 left-4 z-40 flex gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={toggleEditMode}
          className={`p-3 rounded-xl backdrop-blur-md border transition-all ${
            isEditMode 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/30' 
              : 'bg-slate-800/80 border-white/20 text-white/70 hover:text-white'
          }`}
        >
          {isEditMode ? <Shield className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
        </button>
        
        {isEditMode && (
          <>
            <button
              onClick={handleExport}
              className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/20 text-white/70 hover:text-white transition-all"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleImport}
              className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/20 text-white/70 hover:text-white transition-all"
            >
              <Upload className="w-5 h-5" />
            </button>
          </>
        )}
      </motion.div>

      {/* Zoom Controls */}
      <motion.div 
        className="absolute bottom-4 right-4 z-40 flex gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/20 text-white/70 hover:text-white transition-all"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
        <span className="px-3 py-2 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/20 text-white/50 text-sm">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.1))}
          className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-md border border-white/20 text-white/70 hover:text-white transition-all"
        >
          <ChevronRight className="w-5 h-5 rotate-90" />
        </button>
      </motion.div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          className="relative w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: '50%', top: '50%' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                <stop offset="50%" stopColor="rgba(139, 92, 246, 0.5)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0.3)" />
              </linearGradient>
            </defs>
            {nodes.flatMap(node => 
              node.connections.map(targetId => {
                const targetNode = nodeMap.get(targetId);
                if (!targetNode) return null;
                return (
                  <motion.line
                    key={`${node.id}-${targetId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: hoveredNode === node.id || hoveredNode === targetId ? 0.8 : 0.4 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              className="node-element absolute cursor-pointer"
              style={{
                left: `calc(50% + ${node.x}px)`,
                top: `calc(50% + ${node.y}px)`,
                x: '-50%',
                y: '-50%'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: hoveredNode === node.id ? 1.1 : 1, 
                opacity: 1,
                zIndex: hoveredNode === node.id ? 50 : 10
              }}
              transition={{ 
                delay: index * 0.1, 
                type: 'spring', 
                stiffness: 200 
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
            >
              {/* Glow Effect */}
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${node.color} blur-xl opacity-30`}
                style={{ width: node.size * 1.5, height: node.size * 1.5, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
              
              {/* Node Circle */}
              <motion.div
                className={`relative rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center shadow-2xl border-2 border-white/20`}
                style={{ width: node.size, height: node.size }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-white">
                  {node.icon}
                </div>
                
                {/* Pulsing ring for consciousness */}
                {node.type === 'consciousness' && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <motion.div
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="text-white font-semibold text-sm drop-shadow-lg">{node.label}</div>
                {node.sublabel && (
                  <div className="text-white/60 text-xs mt-0.5">{node.sublabel}</div>
                )}
              </motion.div>

              {/* Media Type Indicator */}
              {node.mediaType && node.type !== 'consciousness' && (
                <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${getMediaTypeColor(node.mediaType)} flex items-center justify-center border-2 border-slate-900`}>
                  {node.mediaType === 'photo' && <Image className="w-3 h-3 text-white" />}
                  {node.mediaType === 'video' && <Video className="w-3 h-3 text-white" />}
                  {node.mediaType === 'audio' && <Music className="w-3 h-3 text-white" />}
                  {node.mediaType === 'location' && <MapPin className="w-3 h-3 text-white" />}
                  {node.mediaType === 'text' && <MessageSquare className="w-3 h-3 text-white" />}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute top-4 right-4 bottom-4 w-96 z-50"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
          >
            <div className="h-full bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className={`p-6 bg-gradient-to-br ${selectedNode.color} relative`}>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    {selectedNode.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedNode.label}</h3>
                    <p className="text-white/70">{selectedNode.sublabel}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {isEditingNode ? (
                  <textarea
                    className="w-full h-full bg-slate-950 text-cyan-300 font-mono text-xs p-4 rounded-xl border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    value={editJsonStr}
                    onChange={(e) => setEditJsonStr(e.target.value)}
                  />
                ) : selectedNode.data ? (
                  <div className="space-y-4">
                    {typeof selectedNode.data === 'object' && (
                      <NodeDetailContent data={selectedNode.data} type={selectedNode.type} />
                    )}
                  </div>
                ) : (
                  <div className="text-white/50 text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No detailed data available</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {isEditMode && (
                <div className="p-4 border-t border-white/10 flex gap-2">
                  {isEditingNode ? (
                    <>
                      <button
                        onClick={() => {
                          try {
                            const parsed = JSON.parse(editJsonStr);
                            updateRawData((draft) => {
                              (draft as any)[selectedNode.id] = parsed;
                            });
                            setIsEditingNode(false);
                            // Also optimistically update selectedNode
                            setSelectedNode({ ...selectedNode, data: parsed });
                          } catch (e) {
                            alert("Invalid JSON");
                          }
                        }}
                        className="flex-1 py-2 px-4 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium">
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingNode(false)}
                        className="flex-1 py-2 px-4 rounded-xl bg-slate-500/20 border border-slate-500/40 text-slate-400 hover:bg-slate-500/30 transition-colors text-sm font-medium">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditJsonStr(JSON.stringify(selectedNode.data, null, 2));
                        setIsEditingNode(true);
                      }}
                      className="flex-1 py-2 px-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-medium">
                      Edit Data
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Overlay */}
      {!selectedNode && !hoveredNode && (
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10 text-white/50 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          Click on nodes to explore • Drag to pan • Scroll to zoom
        </motion.div>
      )}
    </div>
  );
}

// Helper component to render node details
function NodeDetailContent({ data, type }: { data: unknown; type: NodeType }) {
  if (!data || typeof data !== 'object') {
    return <div className="text-white/70">No data available</div>;
  }

  const entries = Object.entries(data as Record<string, unknown>);
  
  return (
    <div className="space-y-3">
      {entries.slice(0, 10).map(([key, value]) => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object') {
          return (
            <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-cyan-400 text-sm font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <NodeDetailContent data={value} type={type} />
            </div>
          );
        }
        return (
          <div key={key} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-cyan-400 text-sm font-medium capitalize min-w-[120px]">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-white/80 text-sm flex-1 break-all">
              {typeof value === 'boolean' ? (
                <span className={value ? 'text-green-400' : 'text-red-400'}>{value ? 'Yes' : 'No'}</span>
              ) : Array.isArray(value) ? (
                <div className="flex flex-wrap gap-1">
                  {value.slice(0, 5).map((v, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-white/10 text-xs">{String(v)}</span>
                  ))}
                  {value.length > 5 && (
                    <span className="px-2 py-1 rounded-lg bg-white/10 text-xs">+{value.length - 5} more</span>
                  )}
                </div>
              ) : (
                String(value)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
