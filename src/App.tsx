import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CenterPortrait } from '@/components/CenterPortrait';
import { TimelineCluster } from '@/components/clusters/TimelineCluster';
import { MusicCluster } from '@/components/clusters/MusicCluster';
import { PlacesCluster } from '@/components/clusters/PlacesCluster';
import { ExpertiseCluster } from '@/components/clusters/ExpertiseCluster';
import { GenealogyCluster } from '@/components/clusters/GenealogyCluster';
import { BottomNavigation } from '@/components/BottomNavigation';
import { ZoomView } from '@/components/ZoomView';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { MusicPlayer } from '@/components/MusicPlayer';
import { EditToggle } from '@/components/EditToggle';
import { useVirtualMe } from '@/store/useVirtualMe';
import type { ParisData } from '@/types';

function App() {
  const { 
    setRawData, 
    activeContext, 
    isTransitioning, 
    setIsTransitioning,
    zoom
  } = useVirtualMe();
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/paris.json');
        const data: ParisData = await response.json();
        setRawData(data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setRawData]);

  // Handle context transition
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, setIsTransitioning]);

  // Handle ESC key to exit zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoom.isZoomed) {
        useVirtualMe.getState().resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom.isZoomed]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-cyan-500/30 border-t-cyan-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="text-cyan-400/70 text-sm tracking-wider">Loading VirtualMe...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-30 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">VirtualMe</h1>
                <p className="text-white/40 text-xs">Holographic Profile Interface</p>
              </div>
            </motion.div>

            {/* Context indicator */}
            <motion.div
              className="px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs text-white/50 uppercase tracking-wider">
                Context: <span className="text-cyan-400 font-medium">{activeContext}</span>
              </span>
            </motion.div>
          </div>
        </motion.header>

        {/* Edit Toggle Button */}
        <EditToggle />

        {/* Voice Recorder Button */}
        <VoiceRecorder />

        {/* Music Player Toggle */}
        <MusicPlayer />

        {/* Main Orbit Layout */}
        <main className="flex-1 flex items-center justify-center relative">
          <div className="relative w-[800px] h-[800px] flex items-center justify-center">
            {/* Center Portrait */}
            <motion.div
              className="absolute z-20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: zoom.isZoomed ? 0.7 : 1, 
                opacity: 1 
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CenterPortrait />
            </motion.div>

            {/* Orbiting Clusters */}
            <AnimatePresence>
              {!zoom.isZoomed && (
                <>
                  {/* Timeline - Right */}
                  <motion.div
                    className="absolute"
                    style={{ 
                      right: '80px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <TimelineCluster />
                  </motion.div>

                  {/* Interests - Top Right */}
                  <motion.div
                    className="absolute"
                    style={{ 
                      right: '200px',
                      top: '120px'
                    }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <MusicCluster />
                  </motion.div>

                  {/* Places - Top Left */}
                  <motion.div
                    className="absolute"
                    style={{ 
                      left: '200px',
                      top: '120px'
                    }}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <PlacesCluster />
                  </motion.div>

                  {/* Expertise - Bottom Right */}
                  <motion.div
                    className="absolute"
                    style={{ 
                      right: '200px',
                      bottom: '120px'
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <ExpertiseCluster />
                  </motion.div>

                  {/* Genealogy - Bottom Left */}
                  <motion.div
                    className="absolute"
                    style={{ 
                      left: '200px',
                      bottom: '120px'
                    }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <GenealogyCluster />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Connection Lines (decorative) */}
            {!zoom.isZoomed && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 5 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(100, 200, 255, 0)" />
                    <stop offset="50%" stopColor="rgba(100, 200, 255, 0.2)" />
                    <stop offset="100%" stopColor="rgba(100, 200, 255, 0)" />
                  </linearGradient>
                </defs>
                {/* Lines from center to clusters */}
                <motion.line
                  x1="400" y1="400" x2="680" y2="400"
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.line
                  x1="400" y1="400" x2="580" y2="220"
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
                <motion.line
                  x1="400" y1="400" x2="220" y2="220"
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
                <motion.line
                  x1="400" y1="400" x2="580" y2="580"
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
                <motion.line
                  x1="400" y1="400" x2="220" y2="580"
                  stroke="url(#lineGrad)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </svg>
            )}
          </div>
        </main>

        {/* Bottom Navigation */}
        <footer className="fixed bottom-8 left-0 right-0 z-30 flex justify-center">
          <BottomNavigation />
        </footer>
      </div>

      {/* Zoom View Overlay */}
      <ZoomView />
    </div>
  );
}

export default App;
