import { motion } from 'framer-motion';
import type { LifeTimelineEvent } from '@/types';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

interface TimelineViewProps {
  data: LifeTimelineEvent[];
  isEditMode?: boolean;
}

export function TimelineView({ data, isEditMode = false }: TimelineViewProps) {
  const { updateRawData } = useVirtualMe();

  const handleDelete = (index: number) => {
    updateRawData((d) => {
      d.lifeTimeline.splice(index, 1);
    });
  };

  const handleUpdate = (index: number, field: keyof LifeTimelineEvent, value: string) => {
    updateRawData((d) => {
      if (d.lifeTimeline[index]) {
        (d.lifeTimeline[index] as any)[field] = value;
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-cyan-400 mb-4">
        <Calendar className="w-5 h-5" />
        <span className="text-sm font-medium tracking-wider uppercase">Journey Through Time</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-400/30 to-transparent" />

        {/* Timeline events */}
        <div className="space-y-6">
          {data.map((event, index) => (
            <motion.div
              key={index}
              className="relative pl-12"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Node */}
              <motion.div
                className="absolute left-0 top-1 w-8 h-8 rounded-full bg-slate-800 border-2 border-cyan-400/50 flex items-center justify-center"
                whileHover={{ scale: 1.2, borderColor: 'rgba(100, 200, 255, 0.8)' }}
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
              </motion.div>

              {/* Content card */}
              <div className={`p-4 rounded-xl bg-slate-800/50 border transition-colors ${
                isEditMode ? 'border-cyan-400/30' : 'border-white/10 hover:border-cyan-400/30'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={event.period}
                      onChange={(e) => handleUpdate(index, 'period', e.target.value)}
                      className="text-cyan-300 font-semibold bg-transparent border-b border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <span className="text-cyan-300 font-semibold">{event.period}</span>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {event.ageRange && !isEditMode && (
                      <span className="text-xs text-white/40">Age {event.ageRange}</span>
                    )}
                    {isEditMode && (
                      <motion.button
                        onClick={() => handleDelete(index)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={event.location}
                      onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                      className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs">
                      {event.location}
                    </span>
                  )}
                </div>
                
                {isEditMode ? (
                  <textarea
                    value={event.summary}
                    onChange={(e) => handleUpdate(index, 'summary', e.target.value)}
                    className="w-full text-white/70 text-sm leading-relaxed bg-transparent border border-white/10 rounded-lg p-2 focus:outline-none focus:border-cyan-500/50 resize-none"
                    rows={3}
                  />
                ) : (
                  <p className="text-white/70 text-sm leading-relaxed">{event.summary}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center">
          <div className="text-2xl font-bold text-cyan-400">{data.length}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Phases</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center">
          <div className="text-2xl font-bold text-cyan-400">5+</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Countries</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center">
          <div className="text-2xl font-bold text-cyan-400">40+</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Years</div>
        </div>
      </div>
    </div>
  );
}
