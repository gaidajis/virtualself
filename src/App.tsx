import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, MessageSquare } from 'lucide-react';
import { ParticleBackground } from '@/components/ParticleBackground';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { EditToggle } from '@/components/EditToggle';
import { JsonViewer } from '@/components/JsonViewer';
import { ConsciousnessViewer } from '@/components/ConsciousnessViewer';
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
  const [viewMode, setViewMode] = useState<'consciousness' | 'json'>('consciousness');
  
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
        <main className="flex-1 w-full flex justify-center items-start overflow-hidden pt-4 pb-12 relative">
          {rawData ? (
            viewMode === 'consciousness' ? (
              <ConsciousnessViewer data={rawData} />
            ) : (
              <JsonViewer data={rawData} />
            )
          ) : (
            <div className="text-white/50">No data available</div>
          )}
          
          {/* View Mode Toggle */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-white/20">
              <button
                onClick={() => setViewMode('consciousness')}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  viewMode === 'consciousness'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Consciousness
                </span>
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  viewMode === 'json'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  JSON View
                </span>
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
