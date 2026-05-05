import { motion } from 'framer-motion';
import { useVirtualMe } from '@/store/useVirtualMe';
import type { ContextType } from '@/types';
import { Globe, Heart, Briefcase, Lock, Users, GraduationCap, BookOpen, Sparkles, Pencil, HelpCircle } from 'lucide-react';

const contextIcons: Record<ContextType, React.ElementType> = {
  PUBLIC: Globe,
  DATING: Heart,
  WORK: Briefcase,
  PRIVATE: Lock,
  FAMILY: Users,
  STUDENT: GraduationCap,
  MEMORY: BookOpen,
  ANCESTRY: Sparkles,
  EDIT: Pencil,
  ZOOM_HELP: HelpCircle,
};

const contextColors: Record<ContextType, string> = {
  PUBLIC: 'from-cyan-500 to-blue-500',
  DATING: 'from-pink-500 to-rose-500',
  WORK: 'from-blue-500 to-indigo-500',
  PRIVATE: 'from-violet-500 to-purple-500',
  FAMILY: 'from-amber-500 to-orange-500',
  STUDENT: 'from-emerald-500 to-green-500',
  MEMORY: 'from-rose-500 to-red-500',
  ANCESTRY: 'from-yellow-500 to-amber-500',
  EDIT: 'from-slate-500 to-gray-500',
  ZOOM_HELP: 'from-teal-500 to-cyan-500',
};

export function BottomNavigation() {
  const { 
    activeContext, 
    setActiveContext, 
    setIsTransitioning, 
    zoom,
    isEditMode,
    contextLabels,
    updateContextLabel
  } = useVirtualMe();

  const handleContextChange = (context: ContextType) => {
    if (context === activeContext) return;
    setIsTransitioning(true);
    setActiveContext(context);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const contexts: ContextType[] = ['PUBLIC', 'DATING', 'WORK', 'PRIVATE', 'FAMILY', 'STUDENT', 'MEMORY', 'ANCESTRY'];

  return (
    <motion.div
      className="relative"
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: zoom.isZoomed ? 0.3 : 1,
        scale: zoom.isZoomed ? 0.95 : 1
      }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      {/* Label */}
      <motion.div
        className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-white/40 tracking-[0.3em] uppercase font-medium">
          {isEditMode ? 'Click labels to edit' : 'Select Context'}
        </span>
      </motion.div>

      <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
        {contexts.map((context) => {
          const Icon = contextIcons[context];
          const isActive = activeContext === context;
          const label = contextLabels[context];

          return (
            <motion.button
              key={context}
              onClick={() => handleContextChange(context)}
              className={`relative px-5 py-3 rounded-xl font-semibold text-sm tracking-wider transition-all duration-300 ${
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title={label.description}
            >
              {/* Active background */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${contextColors[context]}`}
                  layoutId="activeContext"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ opacity: 0.95 }}
                />
              )}

              {/* Glow effect */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${contextColors[context]} blur-xl`}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Hover background */}
              {!isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/5 opacity-0 hover:opacity-100 transition-opacity"
                />
              )}

              {/* Content */}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                {isEditMode ? (
                  <input
                    type="text"
                    value={label.name}
                    onChange={(e) => updateContextLabel(context, { name: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border-b border-cyan-400/50 text-white text-center w-20 focus:outline-none focus:border-cyan-400"
                  />
                ) : (
                  label.name
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Context description (editable in edit mode) */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {isEditMode ? (
          <input
            type="text"
            value={contextLabels[activeContext].description}
            onChange={(e) => updateContextLabel(activeContext, { description: e.target.value })}
            className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-1 text-xs text-white/60 text-center focus:outline-none focus:border-cyan-500/50"
          />
        ) : (
          <span className="text-xs text-white/30">
            {contextLabels[activeContext].description}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
