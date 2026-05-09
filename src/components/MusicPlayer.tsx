import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function MusicPlayer() {
  const { isMusicPlaying, setIsMusicPlaying, musicVolume, setMusicVolume } = useVirtualMe();
  const [showVolume, setShowVolume] = useState(false);

  // Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Auto-hide volume slider after 3 seconds
  useEffect(() => {
    if (showVolume) {
      const timer = setTimeout(() => setShowVolume(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolume, musicVolume]);

  // Handle ambient sound synthesis
  useEffect(() => {
    if (isMusicPlaying) {
      // Initialize Audio Context if not exists
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Master Gain Node for volume control
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(musicVolume * 0.3, ctx.currentTime + 2); // Soft attack
      gainNodeRef.current = masterGain;

      // Lowpass filter to make it sound muffled/ambient
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      // Slowly modulate filter
      filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 10);
      filter.connect(masterGain);
      filterNodeRef.current = filter;

      // Create a chord of oscillators for a drone sound
      // Frequencies for a soothing CM7 add9 chord (approx) in low octaves
      const frequencies = [65.41, 98.00, 130.81, 164.81, 196.00];

      oscillatorsRef.current = frequencies.map((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';

        // Slight detune for thickness
        osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.value = 1 / frequencies.length; // Balance levels

        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start();
        return osc;
      });

    } else {
      // Fade out and stop
      if (gainNodeRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 2); // Soft release

        // Cleanup after fade out
        setTimeout(() => {
          oscillatorsRef.current.forEach(osc => osc.stop());
          oscillatorsRef.current = [];
        }, 2000);
      }
    }

    return () => {
      // Cleanup on unmount, but don't kill the audio context abruptly unless needed
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMusicPlaying]);

  // Update volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      // Max volume is scaled down because pure oscillators are loud
      gainNodeRef.current.gain.linearRampToValueAtTime(musicVolume * 0.3, audioCtxRef.current.currentTime + 0.1);
    }
  }, [musicVolume]);

  return (
    <motion.div
      className="fixed top-8 right-48 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
    >
      <div className="relative">
        {/* Main button */}
        <motion.button
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
          onMouseEnter={() => setShowVolume(true)}
          className={`p-3 rounded-full backdrop-blur-md border-2 transition-all ${
            isMusicPlaying 
              ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20' 
              : 'bg-slate-800/80 border-white/20 hover:bg-slate-700/80 hover:border-white/40'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMusicPlaying ? (
              <motion.div
                key="playing"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="flex items-center gap-1"
              >
                <Music className="w-5 h-5 text-green-400" />
                <motion.div
                  className="flex gap-0.5"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-1 h-3 bg-green-400 rounded-full"
                    animate={{ height: [12, 18, 12] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                  />
                  <motion.div 
                    className="w-1 h-4 bg-green-400 rounded-full"
                    animate={{ height: [16, 22, 16] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                  />
                  <motion.div 
                    className="w-1 h-2 bg-green-400 rounded-full"
                    animate={{ height: [8, 14, 8] }}
                    transition={{ duration: 0.3, repeat: Infinity, delay: 0.2 }}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="paused"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
              >
                <VolumeX className="w-5 h-5 text-white/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Volume tooltip */}
        <AnimatePresence>
          {showVolume && (
            <motion.div
              className="absolute top-full mt-3 left-1/2 -translate-x-1/2 p-3 bg-slate-800/95 backdrop-blur-md rounded-xl border border-white/10 shadow-xl"
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              onMouseEnter={() => setShowVolume(true)}
            >
              <div className="flex items-center gap-3 w-32">
                <Volume2 className="w-4 h-4 text-white/50 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgba(74, 222, 128, 0.8) ${musicVolume * 100}%, rgba(255,255,255,0.2) ${musicVolume * 100}%)`
                  }}
                />
              </div>
              <div className="text-center mt-2 text-xs text-white/40">
                {Math.round(musicVolume * 100)}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label */}
        <motion.div 
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-xs text-white/30 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Ambient
        </motion.div>
      </div>
    </motion.div>
  );
}
