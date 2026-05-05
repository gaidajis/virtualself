import { motion } from 'framer-motion';
import type { Profile, Relationships } from '@/types';
import { User, Flag, Languages, Heart, MapPin, Calendar, Users } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

interface GenealogyViewProps {
  profile: Partial<Profile>;
  relationships: Partial<Relationships>;
  isEditMode?: boolean;
}

export function GenealogyView({ profile, relationships, isEditMode = false }: GenealogyViewProps) {
  const { updateRawData } = useVirtualMe();
  const spouse = relationships?.spouse;
  const nationalities = profile?.nationality;

  // Calculate age
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/30 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-amber-400/50 mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-amber-400" />
        </div>
        {isEditMode ? (
          <div className="space-y-2">
            <input
              type="text"
              value={profile?.fullName || ''}
              onChange={(e) => {
                updateRawData((d) => {
                  d.profile.fullName = e.target.value;
                });
              }}
              className="text-2xl font-bold text-amber-100 bg-transparent border-b border-amber-500/30 focus:outline-none focus:border-amber-400 w-full text-center"
            />
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-300/70">Known as</span>
              <input
                type="text"
                value={profile?.preferredName || ''}
                onChange={(e) => {
                  updateRawData((d) => {
                    d.profile.preferredName = e.target.value;
                  });
                }}
                className="text-amber-300/70 bg-transparent border-b border-amber-500/30 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-amber-100 mb-1">{profile?.fullName}</h2>
            <p className="text-amber-300/70">Known as {profile?.preferredName}</p>
          </>
        )}
        {age && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm">
            <Calendar className="w-4 h-4" />
            {age} years old
          </div>
        )}
      </motion.div>

      {/* Birth & Origin */}
      <div>
        <div className="flex items-center gap-2 text-amber-400 mb-4">
          <MapPin className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">Origin</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="p-4 rounded-xl bg-slate-800/50 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Birthplace</div>
            {isEditMode ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={profile?.placeOfBirth?.city || ''}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.profile.placeOfBirth.city = e.target.value;
                    });
                  }}
                  className="text-lg text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-amber-400 w-full"
                />
                <input
                  type="text"
                  value={profile?.placeOfBirth?.country || ''}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.profile.placeOfBirth.country = e.target.value;
                    });
                  }}
                  className="text-sm text-white/60 bg-transparent border-b border-white/10 focus:outline-none focus:border-amber-400 w-full"
                />
              </div>
            ) : (
              <>
                <div className="text-lg text-white">{profile?.placeOfBirth?.city}</div>
                <div className="text-sm text-white/60">{profile?.placeOfBirth?.country}</div>
              </>
            )}
          </motion.div>
          <motion.div
            className="p-4 rounded-xl bg-slate-800/50 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Current Base</div>
            {isEditMode ? (
              <div className="space-y-1">
                <input
                  type="text"
                  value={profile?.currentLocation?.city || ''}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.profile.currentLocation.city = e.target.value;
                    });
                  }}
                  className="text-lg text-white bg-transparent border-b border-white/20 focus:outline-none focus:border-amber-400 w-full"
                />
                <input
                  type="text"
                  value={`${profile?.currentLocation?.canton || ''}, ${profile?.currentLocation?.country || ''}`}
                  onChange={(e) => {
                    const [canton, country] = e.target.value.split(',').map(s => s.trim());
                    updateRawData((d) => {
                      d.profile.currentLocation.canton = canton;
                      d.profile.currentLocation.country = country;
                    });
                  }}
                  className="text-sm text-white/60 bg-transparent border-b border-white/10 focus:outline-none focus:border-amber-400 w-full"
                />
                <input
                  type="number"
                  value={profile?.currentLocation?.sinceYear || ''}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.profile.currentLocation.sinceYear = parseInt(e.target.value);
                    });
                  }}
                  className="text-xs text-white/40 bg-transparent border-b border-white/10 focus:outline-none focus:border-amber-400 w-20"
                />
              </div>
            ) : (
              <>
                <div className="text-lg text-white">{profile?.currentLocation?.city}</div>
                <div className="text-sm text-white/60">
                  {profile?.currentLocation?.canton}, {profile?.currentLocation?.country}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  Since {profile?.currentLocation?.sinceYear}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Nationality */}
      {nationalities && (
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <Flag className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Heritage</span>
          </div>
          <div className="flex gap-4">
            <motion.div
              className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl mb-2">🇨🇾</div>
              {isEditMode ? (
                <input
                  type="text"
                  value={nationalities.mother}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.profile.nationality.mother = e.target.value;
                    });
                  }}
                  className="text-sm text-white/70 bg-transparent border-b border-white/20 focus:outline-none focus:border-amber-400 w-full text-center"
                />
              ) : (
                <div className="text-sm text-white/70">{nationalities.mother}</div>
              )}
              <div className="text-xs text-white/40">Mother&apos;s side</div>
            </motion.div>
            <motion.div
              className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-white/10 text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-3xl mb-2">🇬🇷</div>
              {isEditMode ? (
                <input
                  type="text"
                  value={nationalities.father}
                  onChange={(e) => {
                    updateRawData((d) => {
                      d.profile.nationality.father = e.target.value;
                    });
                  }}
                  className="text-sm text-white/70 bg-transparent border-b border-white/20 focus:outline-none focus:border-amber-400 w-full text-center"
                />
              ) : (
                <div className="text-sm text-white/70">{nationalities.father}</div>
              )}
              <div className="text-xs text-white/40">Father&apos;s side</div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Languages */}
      {profile?.primaryLanguages && profile.primaryLanguages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <Languages className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Languages</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.primaryLanguages.map((lang, i) => (
              <motion.span
                key={i}
                className="px-3 py-2 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-200 text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                {isEditMode ? (
                  <input
                    type="text"
                    value={lang}
                    onChange={(e) => {
                      updateRawData((d) => {
                        d.profile.primaryLanguages[i] = e.target.value;
                      });
                    }}
                    className="bg-transparent text-amber-200 focus:outline-none border-b border-amber-500/30 focus:border-amber-400"
                  />
                ) : (
                  lang
                )}
              </motion.span>
            ))}
          </div>
          {profile.learningLanguages && profile.learningLanguages.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-white/40 mb-2">Currently Learning</div>
              <div className="flex flex-wrap gap-2">
                {profile.learningLanguages.map((lang, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm"
                  >
                    {isEditMode ? (
                      <input
                        type="text"
                        value={lang}
                        onChange={(e) => {
                          updateRawData((d) => {
                            d.profile.learningLanguages[i] = e.target.value;
                          });
                        }}
                        className="bg-transparent text-white/60 focus:outline-none border-b border-white/10 focus:border-white/40"
                      />
                    ) : (
                      lang
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Relationships */}
      {spouse && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Partner</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border border-rose-400/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-rose-400" />
            </div>
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={spouse.fullName}
                    onChange={(e) => {
                      updateRawData((d) => {
                        d.relationships.spouse.fullName = e.target.value;
                      });
                    }}
                    className="text-lg font-semibold text-rose-100 bg-transparent border-b border-rose-500/30 focus:outline-none focus:border-rose-400 w-full"
                  />
                  <input
                    type="text"
                    value={spouse.profession}
                    onChange={(e) => {
                      updateRawData((d) => {
                        d.relationships.spouse.profession = e.target.value;
                      });
                    }}
                    className="text-sm text-rose-300/70 bg-transparent border-b border-rose-500/20 focus:outline-none focus:border-rose-400 w-full"
                  />
                  <input
                    type="text"
                    value={spouse.employer}
                    onChange={(e) => {
                      updateRawData((d) => {
                        d.relationships.spouse.employer = e.target.value;
                      });
                    }}
                    className="text-xs text-rose-400/60 bg-transparent border-b border-rose-500/20 focus:outline-none focus:border-rose-400 w-full"
                  />
                </div>
              ) : (
                <>
                  <div className="text-lg font-semibold text-rose-100">{spouse.fullName}</div>
                  <div className="text-sm text-rose-300/70">{spouse.profession}</div>
                  <div className="text-xs text-rose-400/60">{spouse.employer}</div>
                </>
              )}
              {spouse.assetsUnderManagement && (
                <div className="mt-2 text-xs text-white/50">
                  Managing {spouse.assetsUnderManagement} in institutional assets
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Family summary */}
      {relationships?.family && (
        <motion.div
          className="p-4 rounded-xl bg-slate-800/50 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-sm text-white/50 mb-2">Family Background</div>
          <p className="text-white/70">
            Born to a {relationships.family.motherNationality} mother and{' '}
            {relationships.family.fatherNationality} father, embodying a rich Mediterranean heritage
            with deep roots in both Cyprus and Greece.
          </p>
        </motion.div>
      )}
    </div>
  );
}
