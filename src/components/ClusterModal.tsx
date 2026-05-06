import { motion } from 'framer-motion';
import { useVirtualMe } from '../store/useVirtualMe';

export function ClusterModal() {
  const { selectedCluster, setSelectedCluster, profileData } = useVirtualMe();

  if (!selectedCluster || !profileData) return null;

  const renderContent = () => {
    switch (selectedCluster) {
      case 'TIMELINE':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-8">Life Timeline</h2>
            {profileData.lifeTimeline.map((phase, index) => (
              <motion.div
                key={phase.id}
                className="relative pl-8 pb-8 border-l-2 border-cyan-500/30 last:border-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-cyan-500" />
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-400 font-semibold">{phase.period}</span>
                    {phase.ageRange && <span className="text-white/40 text-sm">{phase.ageRange}</span>}
                  </div>
                  <h3 className="text-white font-medium text-lg mb-2">{phase.location}</h3>
                  <p className="text-white/70">{phase.summary}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'INTERESTS':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Interests & Passions</h2>
            
            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Core Interests</h3>
              <div className="flex flex-wrap gap-3">
                {profileData.interestsMap.coreInterests.map((interest, i) => (
                  <span key={i} className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Music & Media</h3>
              <div className="grid grid-cols-2 gap-4">
                {profileData.mediaAndMusic.favoriteAlbums.slice(0, 4).map((album, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                    <div className="text-pink-400 font-medium">{album.title}</div>
                    <div className="text-white/50 text-sm">{album.artist}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Health Goals</h3>
              <div className="space-y-3">
                {profileData.healthPerformanceAndBody.goals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white/80">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'PLACES':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Places & Locations</h2>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Residence History</h3>
              <div className="space-y-4">
                {profileData.locations.residences.map((place, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">{place.city}, {place.country}</div>
                      <div className="text-white/50 text-sm">{place.period}</div>
                      <div className="text-white/40 text-xs capitalize">{place.type.replace('_', ' ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <div className="text-4xl font-bold text-blue-400 mb-2">{profileData.interestsMap.travelSignals.countriesVisitedApprox}+</div>
              <div className="text-white/70">Countries Visited</div>
            </div>
          </div>
        );

      case 'EXPERTISE':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Professional Expertise</h2>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="text-amber-400 font-semibold text-lg mb-2">{profileData.professionalIdentity.currentPrimaryRole}</div>
              <div className="text-white/70 mb-4">{profileData.professionalIdentity.currentOrganization}</div>
              <p className="text-white/60">{profileData.professionalIdentity.roleSummary}</p>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Key Responsibilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {profileData.professionalIdentity.scope.responsibilities.map((resp, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-white/80 text-sm">{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Platform Ownership</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.professionalIdentity.platformOwnership.map((platform, i) => (
                  <span key={i} className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-300 text-sm">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Skills</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-white/60 text-sm mb-2">Executive & Delivery</div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skillsGraph.executiveAndDelivery.slice(0, 6).map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-700/50 rounded text-white/70 text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'GENEALOGY':
        return (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Profile & Identity</h2>
            
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/5">
              <div className="text-2xl font-bold text-white mb-2">{profileData.owner.fullName}</div>
              <div className="text-white/60 mb-4">{profileData.owner.identityNarrative.short}</div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Date of Birth</div>
                  <div className="text-white">{profileData.owner.dateOfBirth}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Place of Birth</div>
                  <div className="text-white">{profileData.owner.placeOfBirth.city}, {profileData.owner.placeOfBirth.country}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Citizenship</div>
                  <div className="text-white">{profileData.owner.citizenship.passports.join(', ')}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Current Residence</div>
                  <div className="text-white">{profileData.owner.currentResidence.locationLabel}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.languagesAndCulture.languageSignals.knownOrUsed.map((lang, i) => (
                  <span key={i} className="px-3 py-1.5 bg-rose-500/20 border border-rose-500/30 rounded-full text-rose-300 text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-4">Heritage</h3>
              <p className="text-white/70">{profileData.owner.ancestry.heritageSummary}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedCluster(null)}
    >
      <motion.div
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-white/10 m-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedCluster(null)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>

        {/* Footer hint */}
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 to-transparent text-center">
          <span className="text-white/30 text-sm">Press ESC or click outside to close</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
