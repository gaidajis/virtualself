import { motion, useScroll } from 'framer-motion';
import type { LifeTimelineEvent } from '@/types';
import { MapPin, Trash2, Clock } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';
import { useRef } from 'react';

interface TimelineViewProps {
  data: LifeTimelineEvent[];
  isEditMode?: boolean;
}

export function TimelineView({ data, isEditMode = false }: TimelineViewProps) {
  const { updateRawData } = useVirtualMe();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const handleDelete = (index: number) => {
    updateRawData((d) => {
      d.lifeTimeline.splice(index, 1);
    });
  };

  const handleUpdate = (index: number, field: keyof LifeTimelineEvent, value: string) => {
    updateRawData((d) => {
      if (d.lifeTimeline[index]) {
        (d.lifeTimeline[index] as unknown as Record<string, unknown>)[field] = value;
      }
    });
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto" ref={containerRef}>
      <div className="flex items-center justify-between mb-12 mt-4 px-4 md:px-0">
        <div className="flex items-center gap-4 text-cyan-400">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-wider text-white">Journey Through Time</h3>
            <span className="text-sm text-cyan-400/60 uppercase font-medium">Memory Sequence</span>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex gap-4">
          <div className="px-6 py-3 rounded-2xl bg-slate-800/50 border border-white/10 backdrop-blur-md">
            <div className="text-2xl font-bold text-cyan-400">{data.length}</div>
            <div className="text-xs text-white/50 uppercase tracking-wider">Phases</div>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-slate-800/50 border border-white/10 backdrop-blur-md">
            <div className="text-2xl font-bold text-cyan-400">40+</div>
            <div className="text-xs text-white/50 uppercase tracking-wider">Years Active</div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 py-10 px-4 md:px-0 overflow-visible">
        {/* Central Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent transform md:-translate-x-1/2" />

        {/* Animated scroll progress line */}
        <motion.div
          className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 to-blue-500 transform md:-translate-x-1/2 origin-top"
          style={{ scaleY: scrollYProgress }}
        />

        {/* Timeline events */}
        <div className="space-y-24 relative z-10 pb-20">
          {data.map((event, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:justify-start' : 'md:justify-end'}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* Center Node */}
                <motion.div
                  className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center transform -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  whileHover={{ scale: 1.2, borderColor: 'rgba(34, 211, 238, 0.5)' }}
                >
                  <div className="w-4 h-4 rounded-full bg-cyan-400 animate-pulse" />
                </motion.div>

                {/* Content card */}
                <div className={`w-full pl-24 md:pl-0 md:w-[45%] ${isEven ? 'md:pr-16' : 'md:pl-16'}`}>
                  <motion.div
                    className={`p-6 rounded-3xl bg-slate-800/40 backdrop-blur-xl border transition-all duration-300 hover:bg-slate-800/60 shadow-xl ${
                      isEditMode ? 'border-cyan-400/30' : 'border-white/5 hover:border-cyan-400/30 hover:-translate-y-1 hover:shadow-cyan-500/10'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={event.period}
                          onChange={(e) => handleUpdate(index, 'period', e.target.value)}
                          className="text-2xl text-cyan-300 font-bold bg-transparent border-b border-cyan-500/30 focus:outline-none focus:border-cyan-400 w-full md:w-auto"
                        />
                      ) : (
                        <span className="text-2xl text-cyan-300 font-bold tracking-wide">{event.period}</span>
                      )}

                      <div className="flex items-center gap-3">
                        {event.ageRange && !isEditMode && (
                          <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/60 font-medium border border-white/10">
                            Age {event.ageRange}
                          </span>
                        )}
                        {isEditMode && (
                          <motion.button
                            onClick={() => handleDelete(index)}
                            className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-cyan-100/70">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {isEditMode ? (
                        <input
                          type="text"
                          value={event.location}
                          onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                          className="bg-transparent border-b border-cyan-500/30 focus:outline-none focus:border-cyan-400 font-medium"
                        />
                      ) : (
                        <span className="font-medium text-sm">{event.location}</span>
                      )}
                    </div>

                    <div className="relative">
                      {/* Decorative quote mark */}
                      <div className="absolute -top-2 -left-2 text-4xl text-cyan-500/10 font-serif leading-none">"</div>
                      {isEditMode ? (
                        <textarea
                          value={event.summary}
                          onChange={(e) => handleUpdate(index, 'summary', e.target.value)}
                          className="w-full text-white/80 text-base leading-relaxed bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-cyan-500/50 resize-none z-10 relative min-h-[100px]"
                        />
                      ) : (
                        <p className="text-white/80 text-base leading-relaxed relative z-10 pl-4">{event.summary}</p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
