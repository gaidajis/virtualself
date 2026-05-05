import { motion } from 'framer-motion';
import type { LifeTimelineEvent } from '@/types';
import { Globe, MapPin, Compass } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

interface PlacesViewProps {
  data: { countriesVisitedCount: number; notes: string };
  timeline: LifeTimelineEvent[];
  isEditMode?: boolean;
}

// Country flags mapping (simplified)
const countryFlags: Record<string, string> = {
  'Greece': '🇬🇷',
  'Cyprus': '🇨🇾',
  'Cameroon': '🇨🇲',
  'Norway': '🇳🇴',
  'United States': '🇺🇸',
  'Switzerland': '🇨🇭',
};

export function PlacesView({ data, timeline, isEditMode = false }: PlacesViewProps) {
  const { updateRawData } = useVirtualMe();
  
  // Extract unique locations from timeline
  const locations = timeline.map(event => event.location);
  const uniqueLocations = [...new Set(locations)];

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Globe className="w-8 h-8 text-emerald-400" />
        </div>
        {isEditMode ? (
          <input
            type="number"
            value={data.countriesVisitedCount}
            onChange={(e) => {
              updateRawData((d) => {
                d.interestsAndValues.travel.countriesVisitedCount = parseInt(e.target.value) || 0;
              });
            }}
            className="text-5xl font-bold text-emerald-300 bg-transparent border-b-2 border-emerald-500/30 focus:outline-none focus:border-emerald-400 w-24 text-center"
          />
        ) : (
          <div className="text-5xl font-bold text-emerald-300 mb-2">
            {data.countriesVisitedCount}
          </div>
        )}
        <div className="text-sm text-emerald-100/70 uppercase tracking-wider">
          Countries Explored
        </div>
        {isEditMode ? (
          <input
            type="text"
            value={data.notes}
            onChange={(e) => {
              updateRawData((d) => {
                d.interestsAndValues.travel.notes = e.target.value;
              });
            }}
            className="mt-3 text-sm text-emerald-100/50 bg-transparent border-b border-emerald-500/20 focus:outline-none focus:border-emerald-400 w-full text-center"
          />
        ) : (
          <p className="mt-3 text-sm text-emerald-100/50">{data.notes}</p>
        )}
      </motion.div>

      {/* Life journey map */}
      <div>
        <div className="flex items-center gap-2 text-emerald-400 mb-4">
          <Compass className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">Life Journey</span>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500/30 via-emerald-400/20 to-transparent" />

          {/* Location cards */}
          <div className="space-y-4">
            {uniqueLocations.map((location, index) => {
              const flag = countryFlags[location] || '📍';
              const timelineEvent = timeline.find(e => e.location === location);

              return (
                <motion.div
                  key={location}
                  className="relative pl-14"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Flag node */}
                  <motion.div
                    className="absolute left-0 top-0 w-12 h-12 rounded-full bg-slate-800 border-2 border-emerald-400/50 flex items-center justify-center text-2xl"
                    whileHover={{ scale: 1.1, borderColor: 'rgba(52, 211, 153, 0.8)' }}
                  >
                    {flag}
                  </motion.div>

                  {/* Location card */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-emerald-400/30 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-semibold text-emerald-100">{location}</span>
                      {timelineEvent && !isEditMode && (
                        <span className="text-xs text-emerald-400/70">{timelineEvent.period}</span>
                      )}
                    </div>
                    {timelineEvent && (
                      <p className="text-sm text-white/50">{timelineEvent.summary}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Travel stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className="p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{uniqueLocations.length}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Residences</div>
        </motion.div>
        <motion.div
          className="p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Globe className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{data.countriesVisitedCount - uniqueLocations.length}</div>
          <div className="text-xs text-white/50 uppercase tracking-wider">Visited</div>
        </motion.div>
      </div>

      {/* Current location highlight */}
      <motion.div
        className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-400/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Current Base</span>
        </div>
        <div className="text-lg text-white">Bourg-en-Lavaux, Vaud, Switzerland</div>
        <div className="text-sm text-white/50">Since 2018</div>
      </motion.div>
    </div>
  );
}
