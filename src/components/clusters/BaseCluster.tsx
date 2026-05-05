import { motion } from 'framer-motion';
import { useVirtualMe } from '@/store/useVirtualMe';
import { getClusterOpacity } from '@/lib/dataFilter';
import type { ClusterType } from '@/types';

interface BaseClusterProps {
  type: ClusterType;
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  glowColor?: string;
}

export function BaseCluster({
  type,
  label,
  icon,
  children,
  glowColor = 'rgba(100, 200, 255, 0.5)',
}: BaseClusterProps) {
  const { activeCluster, setActiveCluster, activeContext, selectedCluster, setSelectedCluster } = useVirtualMe();
  const isActive = activeCluster === type;
  const opacity = getClusterOpacity(type || '', activeContext);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCluster(type);
    setActiveCluster(type);
  };

  return (
    <motion.div
      className="relative"
      style={{ 
        opacity: selectedCluster && activeCluster !== type ? 0.2 : opacity,
        pointerEvents: selectedCluster && activeCluster !== type ? 'none' : 'auto',
        zIndex: isActive ? 50 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: selectedCluster && activeCluster !== type ? 0.6 : 1, 
        opacity: selectedCluster && activeCluster !== type ? 0.2 : opacity 
      }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Large invisible hit area for easier clicking */}
      <button
        onClick={handleClick}
        className="absolute -inset-12 rounded-full cursor-pointer z-20"
        style={{ background: 'transparent' }}
        aria-label={`View ${label}`}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl pointer-events-none"
        style={{ backgroundColor: glowColor }}
        animate={{
          scale: isActive ? [1, 1.4, 1] : [1, 1.15, 1],
          opacity: isActive ? 0.7 : 0.4,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main cluster node - clickable */}
      <motion.button
        onClick={handleClick}
        className={`relative w-28 h-28 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all duration-300 ${
          isActive 
            ? 'bg-white/25 border-white/40 scale-110' 
            : 'bg-slate-900/70 border-white/30 hover:bg-slate-800/80 hover:border-white/50 hover:scale-105'
        }`}
        style={{
          boxShadow: isActive
            ? `0 0 50px ${glowColor}, inset 0 0 30px ${glowColor}`
            : `0 0 30px ${glowColor}`,
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative z-10">
          {icon}
        </div>
        
        {/* Inner ring animation */}
        <motion.div
          className="absolute inset-3 rounded-full border border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </motion.button>

      {/* Label */}
      <motion.div
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm font-semibold text-white/90 tracking-widest uppercase drop-shadow-lg">
          {label}
        </span>
      </motion.div>

      {/* Click hint - pulsing + icon */}
      <motion.div
        className="absolute -top-2 -right-2 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <div className="w-6 h-6 rounded-full bg-white/30 border-2 border-white/60 flex items-center justify-center backdrop-blur-sm">
          <span className="text-xs text-white font-bold">+</span>
        </div>
      </motion.div>

      {/* Hover tooltip */}
      <motion.div
        className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-white/20 whitespace-nowrap opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        initial={{ opacity: 0, y: 10 }}
      >
        <span className="text-xs text-white/70">Click to explore</span>
      </motion.div>

      {/* Children (visual decorations) */}
      <div className="pointer-events-none">
        {children}
      </div>
    </motion.div>
  );
}
