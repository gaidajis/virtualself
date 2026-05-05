import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualMe } from '@/store/useVirtualMe';
import { X, Lock, Unlock } from 'lucide-react';
import { getFilteredData } from '@/lib/dataFilter';
import { TimelineView } from './panels/TimelineView';
import { InterestsView } from './panels/InterestsView';
import { PlacesView } from './panels/PlacesView';
import { ExpertiseView } from './panels/ExpertiseView';
import { GenealogyView } from './panels/GenealogyView';

export function DetailPanel() {
  const { selectedCluster, setSelectedCluster, rawData, activeContext, isEditMode } = useVirtualMe();

  const handleClose = () => {
    setSelectedCluster(null);
  };

  const getPanelTitle = () => {
    switch (selectedCluster) {
      case 'timeline':
        return 'Life Timeline';
      case 'music':
        return 'Interests & Values';
      case 'places':
        return 'Places & Travel';
      case 'expertise':
        return 'Expertise & Projects';
      case 'genealogy':
        return 'Genealogy & Bio';
      default:
        return '';
    }
  };

  const getPanelContent = () => {
    if (!rawData) return null;
    const filteredData = getFilteredData(rawData, activeContext);

    switch (selectedCluster) {
      case 'timeline':
        return <TimelineView data={filteredData.timeline} isEditMode={isEditMode} />;
      case 'music':
        return <InterestsView data={filteredData.interests} health={filteredData.health} isEditMode={isEditMode} />;
      case 'places':
        return <PlacesView data={rawData.interestsAndValues.travel} timeline={rawData.lifeTimeline} isEditMode={isEditMode} />;
      case 'expertise':
        return (
          <ExpertiseView
            work={filteredData.workExperience}
            education={filteredData.education}
            skills={filteredData.skills}
            projects={filteredData.projects}
            finance={filteredData.finance}
            isEditMode={isEditMode}
          />
        );
      case 'genealogy':
        return (
          <GenealogyView
            profile={filteredData.profile}
            relationships={filteredData.relationships}
            isEditMode={isEditMode}
          />
        );
      default:
        return null;
    }
  };

  const isPrivate = activeContext === 'PRIVATE';

  return (
    <AnimatePresence>
      {selectedCluster && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-2xl z-50 bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <div className="flex items-center gap-4">
                {isPrivate ? (
                  <Unlock className="w-6 h-6 text-violet-400" />
                ) : (
                  <Lock className="w-6 h-6 text-white/40" />
                )}
                <div>
                  <h2 className="text-2xl font-semibold text-white tracking-wide">
                    {getPanelTitle()}
                  </h2>
                  <p className="text-sm text-white/40 mt-1">Click ESC or backdrop to close</p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                className="p-3 rounded-xl hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-white/60" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto h-[calc(100%-100px)] custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCluster + activeContext}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {getPanelContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/10" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/10" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
