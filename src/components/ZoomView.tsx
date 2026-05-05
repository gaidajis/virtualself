import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualMe } from '@/store/useVirtualMe';
import { ZoomOut, MapPin, Music, Briefcase, Users, Calendar, Sparkles, ArrowLeft, Plus } from 'lucide-react';
import { getFilteredData } from '@/lib/dataFilter';
import { TimelineView } from './panels/TimelineView';
import { InterestsView } from './panels/InterestsView';
import { PlacesView } from './panels/PlacesView';
import { ExpertiseView } from './panels/ExpertiseView';
import { GenealogyView } from './panels/GenealogyView';
import { SpotifyPlayer } from './SpotifyPlayer';
import { WorldMap } from './WorldMap';

export function ZoomView() {
  const { 
    zoom, 
    resetZoom, 
    rawData, 
    activeContext,
    isEditMode,
    updateRawData
  } = useVirtualMe();

  if (!zoom.isZoomed || !rawData) return null;

  const filteredData = getFilteredData(rawData, activeContext);

  const getZoomContent = () => {
    switch (zoom.zoomTarget) {
      case 'timeline':
        return (
          <div className="space-y-8">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {isEditMode ? (
                  <input
                    type="text"
                    value={rawData.lifeTimeline?.[0]?.period || 'Life Timeline'}
                    onChange={(e) => {
                      updateRawData((data) => {
                        if (data.lifeTimeline?.[0]) {
                          data.lifeTimeline[0].period = e.target.value;
                        }
                      });
                    }}
                    className="text-4xl font-bold text-white bg-transparent border-b-2 border-cyan-500/50 focus:outline-none focus:border-cyan-400 w-full"
                  />
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-white">Life Timeline</h2>
                    <p className="text-cyan-400/70 text-lg">Journey through time and space</p>
                  </>
                )}
              </div>
              {isEditMode && (
                <motion.button
                  onClick={() => {
                    updateRawData((data) => {
                      data.lifeTimeline.unshift({
                        period: 'New Period',
                        location: 'New Location',
                        summary: 'Add description here...'
                      });
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Event
                </motion.button>
              )}
            </motion.div>
            <TimelineView data={filteredData.timeline} isEditMode={isEditMode} />
          </div>
        );
      
      case 'music':
        return (
          <div className="space-y-8">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white">Interests & Values</h2>
                <p className="text-amber-400/70 text-lg">What drives the passion</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InterestsView 
                data={filteredData.interests} 
                health={filteredData.health}
                isEditMode={isEditMode}
              />
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5 text-green-400" />
                  Music Player
                </h3>
                <SpotifyPlayer />
              </motion.div>
            </div>
          </div>
        );
      
      case 'places':
        return (
          <div className="space-y-8">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value="Places & Travel"
                      className="text-4xl font-bold text-white bg-transparent border-b-2 border-emerald-500/50 focus:outline-none focus:border-emerald-400 w-full"
                    />
                    <input
                      type="number"
                      value={rawData.interestsAndValues.travel.countriesVisitedCount}
                      onChange={(e) => {
                        updateRawData((data) => {
                          data.interestsAndValues.travel.countriesVisitedCount = parseInt(e.target.value) || 0;
                        });
                      }}
                      className="text-lg text-emerald-400/70 bg-transparent border-b border-emerald-500/30 focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-emerald-400/70"> countries explored</span>
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-white">Places & Travel</h2>
                    <p className="text-emerald-400/70 text-lg">{rawData.interestsAndValues.travel.countriesVisitedCount} countries explored</p>
                  </>
                )}
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PlacesView 
                  data={rawData.interestsAndValues.travel} 
                  timeline={rawData.lifeTimeline}
                  isEditMode={isEditMode}
                />
              </motion.div>
              
              <motion.div 
                className="h-[500px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <WorldMap 
                  locations={rawData.lifeTimeline.map(t => t.location)} 
                  countriesVisited={rawData.interestsAndValues.travel.countriesVisitedCount}
                />
              </motion.div>
            </div>
          </div>
        );
      
      case 'expertise':
        return (
          <div className="space-y-8">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-white">Expertise & Projects</h2>
                <p className="text-blue-400/70 text-lg">Professional journey & ventures</p>
              </div>
              {isEditMode && (
                <motion.button
                  onClick={() => {
                    updateRawData((data) => {
                      data.workExperience.unshift({
                        title: 'New Position',
                        organization: 'Company Name',
                        industry: 'Industry',
                        location: 'Location',
                        startApproxYear: new Date().getFullYear(),
                        endApproxYear: null,
                        responsibilities: ['Add responsibility...'],
                        skillsUsed: []
                      });
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </motion.button>
              )}
            </motion.div>
            
            <ExpertiseView 
              work={filteredData.workExperience}
              education={filteredData.education}
              skills={filteredData.skills}
              projects={filteredData.projects}
              finance={filteredData.finance}
              isEditMode={isEditMode}
            />
          </div>
        );
      
      case 'genealogy':
        return (
          <div className="space-y-8">
            <motion.div 
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                {isEditMode ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={rawData.profile.fullName}
                      onChange={(e) => {
                        updateRawData((data) => {
                          data.profile.fullName = e.target.value;
                        });
                      }}
                      className="text-4xl font-bold text-white bg-transparent border-b-2 border-amber-500/50 focus:outline-none focus:border-amber-400 w-full"
                    />
                    <input
                      type="text"
                      value={rawData.profile.preferredName}
                      onChange={(e) => {
                        updateRawData((data) => {
                          data.profile.preferredName = e.target.value;
                        });
                      }}
                      className="text-lg text-amber-400/70 bg-transparent border-b border-amber-500/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-white">Genealogy & Bio</h2>
                    <p className="text-amber-400/70 text-lg">Roots and identity</p>
                  </>
                )}
              </div>
            </motion.div>
            
            <GenealogyView 
              profile={filteredData.profile}
              relationships={filteredData.relationships}
              isEditMode={isEditMode}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 overflow-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={resetZoom}
        />

        {/* Content Container */}
        <motion.div
          className="relative z-10 min-h-screen p-8 pt-24 pb-32"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto">
            {getZoomContent()}
          </div>
        </motion.div>

        {/* Close Button */}
        <motion.button
          className="fixed top-8 right-8 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all group"
          onClick={resetZoom}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
          <span className="text-white/70 group-hover:text-white font-medium">Back</span>
        </motion.button>

        {/* Zoom Out Hint */}
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ZoomOut className="w-4 h-4 text-white/50" />
          <span className="text-white/50 text-sm">Press ESC or click backdrop to exit</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
