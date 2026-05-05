import { motion } from 'framer-motion';
import { BaseCluster } from './BaseCluster';
import { Calendar, MapPin } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function TimelineCluster() {
  const { rawData, zoom } = useVirtualMe();
  const timelineEvents = rawData?.lifeTimeline?.slice(0, 4) || [];

  return (
    <BaseCluster
      type="timeline"
      label="Timeline"
      icon={<Calendar className="w-8 h-8 text-cyan-400" />}
      glowColor="rgba(100, 200, 255, 0.4)"
    >
      {/* Floating photo cards */}
      {!zoom.isZoomed && timelineEvents.map((event, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-20 rounded-lg overflow-hidden border border-white/20 bg-slate-800/80 backdrop-blur-sm"
          style={{
            left: `${-60 + i * 25}px`,
            top: `${-40 + i * 15}px`,
            zIndex: 4 - i,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 0.7 - i * 0.15,
            scale: 1 - i * 0.05,
            y: [0, -5, 0],
          }}
          transition={{
            opacity: { delay: 0.3 + i * 0.1 },
            y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex flex-col items-center justify-center p-1">
            <MapPin className="w-4 h-4 text-cyan-400/60 mb-1" />
            <span className="text-[8px] text-white/60 text-center leading-tight">
              {event.location.split(',')[0]}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Decorative dots */}
      {!zoom.isZoomed && [...Array(5)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/60"
          style={{
            left: `${-30 + i * 15}px`,
            top: `${30 + i * 8}px`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </BaseCluster>
  );
}
