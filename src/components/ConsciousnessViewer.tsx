import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Image, Video, Music, Brain, Users,
  Heart, Target, Briefcase, Sparkles,
  ChevronRight, ChevronDown, X, Trash2, Download, Upload,
  Clock, MessageSquare, Zap, Award, Shield, Lock
} from 'lucide-react';
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

export function ConsciousnessViewer({ data }: ConsciousnessViewerProps) {
  const { isEditMode, toggleEditMode, exportData, importData } = useVirtualMe();
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate nodes from data
  const nodes: NodeData[] = useMemo(() => {
    const nodeList: NodeData[] = [];
    const centerX = 0;
    const centerY = 0;

    // Central consciousness node
    nodeList.push({
      id: 'consciousness',
      type: 'consciousness',
      label: data.profile?.preferredName || data.profile?.fullName || 'VirtualMe',
      sublabel: 'Core Consciousness',
      icon: <Brain className="w-6 h-6" />,
      color: 'from-cyan-400 via-blue-500 to-purple-600',
      size: 80,
      x: centerX,
      y: centerY,
      connections: [],
      mediaType: 'text'
    });

    const radius = 200;
    let angle = 0;
    const angleStep = (Math.PI * 2) / 8;

    // Thoughts & Personality
    angle += angleStep;
    nodeList.push({
      id: 'thoughts',
      type: 'thought',
      label: 'Thoughts',
      sublabel: `${data.personalityModel?.selfDescription?.length || 0} traits`,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-yellow-400 via-orange-500 to-red-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.personalityModel,
      mediaType: 'text'
    });

    // Memories & Timeline
    angle += angleStep;
    nodeList.push({
      id: 'memories',
      type: 'memory',
      label: 'Memories',
      sublabel: `${data.lifeTimeline?.length || 0} moments`,
      icon: <Clock className="w-5 h-5" />,
      color: 'from-purple-400 via-pink-500 to-rose-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.lifeTimeline,
      mediaType: 'text'
    });

    // Places
    angle += angleStep;
    nodeList.push({
      id: 'places',
      type: 'place',
      label: 'Places',
      sublabel: data.profile?.currentLocation?.city || 'Locations',
      icon: <MapPin className="w-5 h-5" />,
      color: 'from-green-400 via-emerald-500 to-teal-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.profile?.currentLocation,
      mediaType: 'location'
    });

    // People & Connections
    angle += angleStep;
    nodeList.push({
      id: 'connections',
      type: 'connection',
      label: 'Connections',
      sublabel: data.relationships?.maritalStatus === 'married' ? 'Married' : 'Social',
      icon: <Users className="w-5 h-5" />,
      color: 'from-pink-400 via-rose-500 to-red-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.relationships,
      mediaType: 'text'
    });

    // Skills & Expertise
    angle += angleStep;
    nodeList.push({
      id: 'skills',
      type: 'skill',
      label: 'Skills',
      sublabel: `${Object.keys(data.skills || {}).length} domains`,
      icon: <Award className="w-5 h-5" />,
      color: 'from-blue-400 via-indigo-500 to-violet-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.skills,
      mediaType: 'text'
    });

    // Projects
    angle += angleStep;
    nodeList.push({
      id: 'projects',
      type: 'project',
      label: 'Projects',
      sublabel: `${Object.keys(data.projects || {}).length} active`,
      icon: <Zap className="w-5 h-5" />,
      color: 'from-amber-400 via-orange-500 to-red-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.projects,
      mediaType: 'text'
    });

    // Health & Goals
    angle += angleStep;
    nodeList.push({
      id: 'health',
      type: 'health',
      label: 'Health',
      sublabel: 'Wellness & Goals',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-red-400 via-pink-500 to-rose-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.healthAndPerformance,
      mediaType: 'text'
    });

    // Work & Education
    angle += angleStep;
    nodeList.push({
      id: 'work',
      type: 'skill',
      label: 'Work',
      sublabel: data.workExperience?.[0]?.title || 'Career',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-slate-400 via-gray-500 to-zinc-500',
      size: 60,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      connections: ['consciousness'],
      data: data.workExperience,
      mediaType: 'text'
    });

    // Add secondary nodes for projects
    if (data.projects) {
      const projectKeys = Object.keys(data.projects as unknown as Record<string, unknown>);
      projectKeys.forEach((key, idx) => {
        const project = (data.projects as unknown as Record<string, Record<string, string>>)[key];
        const projAngle = angle + (idx * 0.3);
        nodeList.push({
          id: `project-${key}`,
          type: 'project',
          label: project?.title || key,
          sublabel: 'Active Project',
          icon: <Target className="w-4 h-4" />,
          color: 'from-amber-500 via-yellow-500 to-orange-500',
          size: 40,
          x: Math.cos(projAngle) * (radius + 100),
          y: Math.sin(projAngle) * (radius + 100),
          connections: ['projects'],
          data: project,
          mediaType: 'text'
        });
      });
    }

    return nodeList;
  }, [data]);

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
    <div className="relative w-full h-full overflow-hidden">
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
                const targetNode = nodes.find(n => n.id === targetId);
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
                {selectedNode.data ? (
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
                  <button className="flex-1 py-2 px-4 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 transition-colors text-sm font-medium">
                    Edit
                  </button>
                  <button className="py-2 px-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
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
