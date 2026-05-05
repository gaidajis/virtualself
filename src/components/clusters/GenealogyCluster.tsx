import { motion } from 'framer-motion';
import { BaseCluster } from './BaseCluster';
import { Users, Lock, Unlock, Flag, Languages } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function GenealogyCluster() {
  const { rawData, activeContext, zoom } = useVirtualMe();
  const isPrivate = activeContext === 'PRIVATE';
  const isDating = activeContext === 'DATING';
  
  const profile = rawData?.profile;
  const languages = profile?.primaryLanguages?.slice(0, 3) || [];
  const nationalities = profile?.nationality;

  // Tree branch points
  const branchPoints = [
    { x: 0, y: 0 },
    { x: -25, y: -20 },
    { x: 25, y: -20 },
    { x: -40, y: -40 },
    { x: -10, y: -40 },
    { x: 10, y: -40 },
    { x: 40, y: -40 },
  ];

  return (
    <BaseCluster
      type="genealogy"
      label="Genealogy"
      icon={isPrivate ? <Unlock className="w-8 h-8 text-amber-400" /> : <Users className="w-8 h-8 text-amber-400" />}
      glowColor="rgba(251, 191, 36, 0.4)"
    >
      {/* Family tree visualization */}
      {!zoom.isZoomed && (
        <svg
          className="absolute -inset-12 w-40 h-40 pointer-events-none"
          viewBox="-50 -50 100 100"
        >
          {/* Tree branches */}
          <motion.path
            d="M 0 0 L -25 -20 M 0 0 L 25 -20 M -25 -20 L -40 -40 M -25 -20 L -10 -40 M 25 -20 L 10 -40 M 25 -20 L 40 -40"
            stroke="rgba(251, 191, 36, 0.3)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          {/* Tree nodes */}
          {branchPoints.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={i === 0 ? 4 : 2.5}
              fill={i === 0 ? 'rgba(251, 191, 36, 0.9)' : 'rgba(251, 191, 36, 0.6)'}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}

          {/* Glow pulses on main node */}
          <motion.circle
            cx={0}
            cy={0}
            r={8}
            fill="none"
            stroke="rgba(251, 191, 36, 0.4)"
            strokeWidth="1"
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      )}

      {/* Lock/Unlock animation for private mode */}
      {!zoom.isZoomed && (
        <motion.div
          className="absolute -top-6 -left-6"
          animate={isPrivate ? {
            rotate: [0, -20, 20, 0],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {isPrivate ? (
            <Unlock className="w-5 h-5 text-amber-400/80" />
          ) : (
            <Lock className="w-5 h-5 text-amber-400/40" />
          )}
        </motion.div>
      )}

      {/* Language badges */}
      {!zoom.isZoomed && (isDating || isPrivate) && languages.map((lang, i) => {
        const langCode = lang.split(' ')[0].slice(0, 3).toUpperCase();
        return (
          <motion.div
            key={i}
            className="absolute flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm"
            style={{
              left: `${-70 + i * 30}px`,
              top: `${25 + i * 12}px`,
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <Languages className="w-3 h-3 text-amber-400/70" />
            <span className="text-[8px] text-amber-300">{langCode}</span>
          </motion.div>
        );
      })}

      {/* Nationality indicators */}
      {!zoom.isZoomed && nationalities && (isDating || isPrivate) && (
        <motion.div
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
            <Flag className="w-3 h-3 text-amber-400/70" />
            <span className="text-[8px] text-amber-300">{nationalities.mother}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
            <Flag className="w-3 h-3 text-amber-400/70" />
            <span className="text-[8px] text-amber-300">{nationalities.father}</span>
          </div>
        </motion.div>
      )}

      {/* Decorative flowing lines */}
      {!zoom.isZoomed && (
        <motion.div
          className="absolute -inset-8 rounded-full border border-amber-400/10"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      )}
    </BaseCluster>
  );
}
