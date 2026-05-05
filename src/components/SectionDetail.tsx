import { motion } from 'framer-motion';
import { useVirtualMe2 } from '@/store/useVirtualMe2';
import { ArrowLeft } from 'lucide-react';
import type { Section } from '@/types/virtualme2';

interface SectionDetailProps {
  section: Section;
}

export function SectionDetail({ section }: SectionDetailProps) {
  const { zoomToOverview } = useVirtualMe2();

  const renderContent = () => {
    switch (section.type) {
      case 'knowledge':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">{section.content.currentRole}</h3>
              <p className="text-white/60">{section.content.organization}</p>
              <p className="text-white/40 text-sm">{section.content.location}</p>
              <p className="text-white/70 mt-4">{section.content.summary}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">Achievements</h4>
              <div className="space-y-2">
                {section.content.achievements?.map((achievement, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-white/5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    <span className="text-white/80">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            {section.content.institutions?.map((inst) => (
              <motion.div
                key={inst.id}
                className="p-5 rounded-2xl bg-slate-800/50 border border-white/10"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{inst.name}</h3>
                    <p className="text-white/60">{inst.degree}</p>
                    <p className="text-white/40 text-sm">{inst.years} • {inst.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    inst.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                    inst.status === 'ongoing' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {inst.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'languages':
        return (
          <div className="grid grid-cols-2 gap-4">
            {section.content.languages?.map((lang) => (
              <motion.div
                key={lang.id}
                className="p-4 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <h3 className="font-semibold text-white">{lang.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    lang.level === 'native' ? 'bg-green-500/20 text-green-400' :
                    lang.level === 'fluent' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    {lang.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'interests':
        return (
          <div className="space-y-6">
            {section.content.categories?.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                  {cat.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-slate-800/50 border border-white/10 text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'timeline':
        return (
          <div className="relative space-y-6">
            {/* Timeline line */}
            <div 
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: `${section.color}40` }}
            />
            
            {section.content.events?.map((event, i) => (
              <motion.div
                key={event.id}
                className="relative pl-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Dot */}
                <div 
                  className="absolute left-2 top-1.5 w-4 h-4 rounded-full border-2 border-slate-900"
                  style={{ backgroundColor: section.color }}
                />
                
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold" style={{ color: section.color }}>
                      {event.year}
                    </span>
                    <h3 className="font-semibold text-white">{event.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm">{event.location}</p>
                  {event.description && (
                    <p className="text-white/40 text-sm mt-2">{event.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {section.content.skills
                  ?.filter(s => s.category === 'technical')
                  .map((skill) => (
                    <motion.div
                      key={skill.id}
                      className="px-4 py-2 rounded-xl bg-slate-800/50 border border-white/10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-white/80">{skill.name}</span>
                      {skill.level && (
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-1 rounded-full ${
                                i < skill.level! ? 'bg-blue-400' : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider mb-3">
                Soft Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {section.content.skills
                  ?.filter(s => s.category === 'soft')
                  .map((skill) => (
                    <span
                      key={skill.id}
                      className="px-4 py-2 rounded-full bg-slate-800/30 border border-white/10 text-white/70"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
        onClick={zoomToOverview}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 min-h-screen p-8 pt-24 pb-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              onClick={zoomToOverview}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-white/70" />
            </motion.button>
            
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${section.color}30` }}
            >
              <span className="text-2xl" style={{ color: section.color }}>
                {section.icon.charAt(0)}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white">{section.title}</h1>
              <p className="text-white/50">Click outside to return to overview</p>
            </div>
          </div>

          {/* Section Content */}
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}
