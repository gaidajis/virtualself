import { motion } from 'framer-motion';
import { BaseCluster } from './BaseCluster';
import { Music, Heart, Plane, Sparkles } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function MusicCluster() {
  const { rawData, zoom } = useVirtualMe();
  const interests = rawData?.interestsAndValues?.coreInterests?.slice(0, 3) || [];

  // Get icons based on interest content
  const getInterestIcon = (interest: string) => {
    if (interest.includes('health') || interest.includes('heart')) return Heart;
    if (interest.includes('travel') || interest.includes('Japan')) return Plane;
    return Sparkles;
  };

  return (
    <BaseCluster
      type="music"
      label="Interests"
      icon={<Music className="w-8 h-8 text-amber-400" />}
      glowColor="rgba(251, 191, 36, 0.4)"
    >
      {/* Audio visualizer rings */}
      {!zoom.isZoomed && (
        <>
          <motion.div
            className="absolute -inset-8 rounded-full border border-amber-400/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -inset-12 rounded-full border border-amber-400/10"
            animate={{
              scale: [1.1, 1.3, 1.1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
        </>
      )}

      {/* Floating interest cards */}
      {!zoom.isZoomed && interests.map((interest, i) => {
        const Icon = getInterestIcon(interest);
        return (
          <motion.div
            key={i}
            className="absolute w-14 h-14 rounded-lg overflow-hidden border border-amber-400/30 bg-slate-800/80 backdrop-blur-sm flex items-center justify-center"
            style={{
              right: `${-50 + i * 20}px`,
              top: `${-30 + i * 25}px`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 0.8,
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { delay: 0.4 + i * 0.1 },
              y: { duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <Icon className="w-6 h-6 text-amber-400/70" />
          </motion.div>
        );
      })}

      {/* Visualizer bars */}
      {!zoom.isZoomed && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-1">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-amber-500/40 to-amber-300/80 rounded-full"
              animate={{
                height: [8, 20 + Math.random() * 15, 8],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
              style={{ height: 8 }}
            />
          ))}
        </div>
      )}
    </BaseCluster>
  );
}
