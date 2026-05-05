import { motion } from 'framer-motion';
import { BaseCluster } from './BaseCluster';
import { Globe, Lock, Unlock } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function PlacesCluster() {
  const { rawData, activeContext, zoom } = useVirtualMe();
  const countriesVisited = rawData?.interestsAndValues?.travel?.countriesVisitedCount || 50;
  const isPrivate = activeContext === 'PRIVATE';

  // Generate constellation points
  const constellationPoints = [
    { x: -40, y: -30 },
    { x: -20, y: -45 },
    { x: 10, y: -35 },
    { x: 35, y: -40 },
    { x: 50, y: -20 },
    { x: 30, y: 10 },
    { x: 0, y: 20 },
    { x: -30, y: 15 },
    { x: -50, y: -5 },
  ];

  return (
    <BaseCluster
      type="places"
      label="Places"
      icon={<Globe className="w-8 h-8 text-emerald-400" />}
      glowColor="rgba(52, 211, 153, 0.4)"
    >
      {/* Constellation map */}
      {!zoom.isZoomed && (
        <svg
          className="absolute -inset-16 w-48 h-48 pointer-events-none"
          viewBox="-60 -60 120 120"
        >
          {/* Connection lines */}
          {constellationPoints.map((point, i) =>
            constellationPoints.slice(i + 1).map((other, j) => {
              const distance = Math.sqrt(
                Math.pow(point.x - other.x, 2) + Math.pow(point.y - other.y, 2)
              );
              if (distance > 50) return null;
              return (
                <motion.line
                  key={`${i}-${j}`}
                  x1={point.x}
                  y1={point.y}
                  x2={other.x}
                  y2={other.y}
                  stroke="rgba(52, 211, 153, 0.2)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                />
              );
            })
          )}

          {/* Nodes */}
          {constellationPoints.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={2}
              fill="rgba(52, 211, 153, 0.8)"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                scale: { duration: 2, repeat: Infinity, delay: i * 0.2 },
              }}
            />
          ))}
        </svg>
      )}

      {/* Country count badge */}
      {!zoom.isZoomed && (
        <motion.div
          className="absolute -top-8 -right-8 w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center backdrop-blur-sm"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <span className="text-xs font-bold text-emerald-300">{countriesVisited}</span>
        </motion.div>
      )}

      {/* Lock/Unlock icon for non-private contexts */}
      {!zoom.isZoomed && (
        <motion.div
          className="absolute top-0 right-0"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {isPrivate ? (
            <Unlock className="w-4 h-4 text-emerald-400/60" />
          ) : (
            <Lock className="w-4 h-4 text-emerald-400/40" />
          )}
        </motion.div>
      )}

      {/* Floating location indicators */}
      {!zoom.isZoomed && ['Greece', 'Cyprus', 'CH', 'USA'].map((loc, i) => (
        <motion.div
          key={loc}
          className="absolute text-[8px] text-emerald-400/50 font-mono"
          style={{
            right: `${20 + i * 15}px`,
            bottom: `${-20 + i * 10}px`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        >
          {loc}
        </motion.div>
      ))}
    </BaseCluster>
  );
}
