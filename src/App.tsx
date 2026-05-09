import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ParticleBackground } from '@/components/ParticleBackground';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { EditToggle } from '@/components/EditToggle';
import { JsonViewer } from '@/components/JsonViewer';
import { useVirtualMe } from '@/store/useVirtualMe';
import type { ParisData } from '@/types';

function App() {
  const { 
    setRawData, 
    rawData,
    isTransitioning,
    setIsTransitioning
  } = useVirtualMe();
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const basePath = import.meta.env.BASE_URL || '/';
        const response = await fetch(`${basePath}paris.json`);
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
    <div className="relative min-h-screen bg-slate-950 flex flex-col">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col p-8">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between max-w-7xl mx-auto w-full mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-xl">VirtualMe</h1>
              <p className="text-white/40 text-xs">Living Identity Graph</p>
            </div>
          </motion.div>

          <div className="flex gap-4">
            <EditToggle />
            <VoiceRecorder />
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 w-full flex justify-center items-start overflow-hidden pt-4 pb-12">
          {rawData ? (
            <JsonViewer data={rawData} />
          ) : (
            <div className="text-white/50">No data available</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
