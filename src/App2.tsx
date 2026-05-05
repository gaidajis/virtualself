import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfiniteCanvas } from '@/components/InfiniteCanvas';
import { CentralPortrait } from '@/components/CentralPortrait';
import { SectionNode, AddSectionButton } from '@/components/SectionNode';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { SectionDetail } from '@/components/SectionDetail';
import { useVirtualMe2 } from '@/store/useVirtualMe2';

function App2() {
  const { 
    data, 
    zoomLevel, 
    activeSectionId, 
    zoomToOverview
  } = useVirtualMe2();

  const activeProfileId = data.metadata.activeProfileId;
  const activeProfile = data.profiles.find(p => p.id === activeProfileId);
  const activeSection = data.sections.find(s => s.id === activeSectionId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomLevel !== 'overview') {
        zoomToOverview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel, zoomToOverview]);

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ 
            background: activeProfile 
              ? `linear-gradient(135deg, ${activeProfile.theme.primary}, ${activeProfile.theme.accent})`
              : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ 
            background: activeProfile 
              ? `linear-gradient(135deg, ${activeProfile.theme.accent}, ${activeProfile.theme.primary})`
              : 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
          }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main Canvas */}
      <InfiniteCanvas>
        {/* Central Portrait */}
        <CentralPortrait />

        {/* Section Nodes */}
        {data.sections.map((section) => (
          <SectionNode 
            key={section.id} 
            section={section} 
            profileId={activeProfileId}
          />
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
          {data.connections.map((conn, i) => {
            const fromSection = data.sections.find(s => s.id === conn.from);
            const toSection = data.sections.find(s => s.id === conn.to);
            if (!fromSection || !toSection) return null;

            return (
              <motion.line
                key={i}
                x1={fromSection.position.x}
                y1={fromSection.position.y}
                x2={toSection.position.x}
                y2={toSection.position.y}
                stroke={fromSection.color}
                strokeWidth="1"
                strokeOpacity={conn.strength * 0.5}
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            );
          })}
        </svg>
      </InfiniteCanvas>

      {/* Header */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10">
          <motion.div 
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: activeProfile?.theme.primary || '#3b82f6' }}
          />
          <span className="text-white/50 text-sm tracking-wider uppercase font-medium">
            VirtualMe <span className="text-white/80">2.0</span>
          </span>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="absolute top-6 right-6 z-50 hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-white/10 text-right">
          <p className="text-white/40 text-xs tracking-wider uppercase mb-1">Navigation</p>
          <p className="text-white/30 text-xs">Scroll to zoom</p>
          <p className="text-white/30 text-xs">Drag to pan</p>
          <p className="text-white/30 text-xs">Click sections to explore</p>
          <p className="text-white/30 text-xs">ESC to return</p>
        </div>
      </motion.div>

      {/* Section Detail Overlay */}
      <AnimatePresence>
        {zoomLevel === 'section' && activeSection && (
          <SectionDetail section={activeSection} />
        )}
      </AnimatePresence>

      {/* Profile Switcher */}
      <ProfileSwitcher />

      {/* Add Section Button (Edit Mode) */}
      <AddSectionButton />

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-24 left-6 px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-white/60 text-sm">
        {zoomLevel === 'overview' ? 'Overview' : zoomLevel === 'section' ? 'Section View' : 'Detail View'}
      </div>
    </div>
  );
}

export default App2;
