import { motion } from 'framer-motion';
import type { InterestsAndValues, HealthAndPerformance } from '@/types';
import { Heart, Sparkles, Plane, Music, Target, Moon, Apple, Dumbbell, Plus, X } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

interface InterestsViewProps {
  data: Partial<InterestsAndValues>;
  health: Partial<HealthAndPerformance>;
  isEditMode?: boolean;
}

const interestIcons: Record<string, React.ElementType> = {
  'energy': Target,
  'hydro': Target,
  'trading': Target,
  'physics': Sparkles,
  'health': Heart,
  'minimalism': Sparkles,
  'Japanese': Plane,
  'music': Music,
  'travel': Plane,
};

const getIconForInterest = (interest: string) => {
  for (const [key, icon] of Object.entries(interestIcons)) {
    if (interest.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return Sparkles;
};

export function InterestsView({ data, health, isEditMode = false }: InterestsViewProps) {
  const { updateRawData } = useVirtualMe();
  
  const interests = data.coreInterests || [];
  const values = data.values || [];
  const travel = data.travel;
  const healthGoals = health.goals;

  const handleAddInterest = () => {
    updateRawData((d) => {
      d.interestsAndValues.coreInterests.push('New Interest');
    });
  };

  const handleUpdateInterest = (index: number, value: string) => {
    updateRawData((d) => {
      d.interestsAndValues.coreInterests[index] = value;
    });
  };

  const handleDeleteInterest = (index: number) => {
    updateRawData((d) => {
      d.interestsAndValues.coreInterests.splice(index, 1);
    });
  };

  return (
    <div className="space-y-6">
      {/* Interests section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Core Interests</span>
          </div>
          {isEditMode && (
            <motion.button
              onClick={handleAddInterest}
              className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => {
            const Icon = getIconForInterest(interest);
            return (
              <motion.div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/10 border transition-all ${
                  isEditMode ? 'border-amber-400/50' : 'border-amber-400/30 hover:border-amber-400/60'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={!isEditMode ? { scale: 1.05 } : undefined}
              >
                <Icon className="w-4 h-4 text-amber-400" />
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      value={interest}
                      onChange={(e) => handleUpdateInterest(index, e.target.value)}
                      className="bg-transparent text-amber-100 text-sm focus:outline-none border-b border-amber-500/30 focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleDeleteInterest(index)}
                      className="text-amber-400/50 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-amber-100">{interest}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Travel section */}
      {travel && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <Plane className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Travel</span>
          </div>
          <div className="flex items-center gap-4">
            {isEditMode ? (
              <input
                type="number"
                value={travel.countriesVisitedCount}
                onChange={(e) => {
                  updateRawData((d) => {
                    d.interestsAndValues.travel.countriesVisitedCount = parseInt(e.target.value) || 0;
                  });
                }}
                className="text-4xl font-bold text-emerald-300 bg-transparent border-b border-emerald-500/30 focus:outline-none focus:border-emerald-400 w-20"
              />
            ) : (
              <div className="text-4xl font-bold text-emerald-300">{travel.countriesVisitedCount}</div>
            )}
            <div className="text-sm text-emerald-100/70">
              Countries visited
              <br />
              {isEditMode ? (
                <input
                  type="text"
                  value={travel.notes}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.interestsAndValues.travel.notes = e.target.value;
                    });
                  }}
                  className="text-xs text-emerald-100/50 bg-transparent border-b border-emerald-500/20 focus:outline-none focus:border-emerald-400 w-full"
                />
              ) : (
                <span className="text-xs text-emerald-100/50">{travel.notes}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Values section */}
      {values.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Core Values</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-400/20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      updateRawData((d) => {
                        d.interestsAndValues.values[index] = e.target.value;
                      });
                    }}
                    className="text-sm text-purple-200 capitalize bg-transparent w-full text-center focus:outline-none border-b border-purple-500/30 focus:border-purple-400"
                  />
                ) : (
                  <span className="text-sm text-purple-200 capitalize">{value}</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Health section */}
      {healthGoals && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Health & Performance</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Dumbbell className="w-4 h-4 text-rose-400 mt-0.5" />
              {isEditMode ? (
                <input
                  type="text"
                  value={healthGoals.exercise}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.healthAndPerformance.goals.exercise = e.target.value;
                    });
                  }}
                  className="text-sm text-rose-100/80 bg-transparent flex-1 border-b border-rose-500/30 focus:outline-none focus:border-rose-400"
                />
              ) : (
                <span className="text-sm text-rose-100/80">{healthGoals.exercise}</span>
              )}
            </div>
            <div className="flex items-start gap-3">
              <Apple className="w-4 h-4 text-rose-400 mt-0.5" />
              {isEditMode ? (
                <input
                  type="text"
                  value={healthGoals.nutrition}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.healthAndPerformance.goals.nutrition = e.target.value;
                    });
                  }}
                  className="text-sm text-rose-100/80 bg-transparent flex-1 border-b border-rose-500/30 focus:outline-none focus:border-rose-400"
                />
              ) : (
                <span className="text-sm text-rose-100/80">{healthGoals.nutrition}</span>
              )}
            </div>
            <div className="flex items-start gap-3">
              <Moon className="w-4 h-4 text-rose-400 mt-0.5" />
              {isEditMode ? (
                <input
                  type="text"
                  value={healthGoals.sleep}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.healthAndPerformance.goals.sleep = e.target.value;
                    });
                  }}
                  className="text-sm text-rose-100/80 bg-transparent flex-1 border-b border-rose-500/30 focus:outline-none focus:border-rose-400"
                />
              ) : (
                <span className="text-sm text-rose-100/80">{healthGoals.sleep}</span>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Lifestyle preferences */}
      {data.lifestylePreferences && (
        <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
          <div className="text-sm text-white/50 mb-2">Lifestyle Preferences</div>
          <div className="flex flex-wrap gap-2">
            {data.lifestylePreferences.aesthetic?.map((pref, i) => (
              <span key={i} className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                {pref}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
