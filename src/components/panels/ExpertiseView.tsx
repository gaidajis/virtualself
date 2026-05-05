import { motion } from 'framer-motion';
import type { WorkExperience, Education, Skills, Projects, FinanceAndWorkstyle } from '@/types';
import { Briefcase, GraduationCap, Cpu, Zap, TrendingUp, Target, DollarSign, Trash2 } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

interface ExpertiseViewProps {
  work: WorkExperience[];
  education: Education[];
  skills: Partial<Skills>;
  projects: Partial<Projects>;
  finance?: Partial<FinanceAndWorkstyle>;
  isEditMode?: boolean;
}

export function ExpertiseView({ work, education, skills, projects, finance, isEditMode = false }: ExpertiseViewProps) {
  const { updateRawData } = useVirtualMe();
  const hydroProject = projects?.hydroPortfolio;
  const jouleCrypto = projects?.jouleCrypto;

  const handleDeleteWork = (index: number) => {
    updateRawData((d) => {
      d.workExperience.splice(index, 1);
    });
  };

  const handleUpdateWork = (index: number, field: keyof WorkExperience, value: string | number | string[] | null) => {
    updateRawData((d) => {
      if (d.workExperience[index]) {
        (d.workExperience[index] as any)[field] = value;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Work Experience */}
      {work.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Briefcase className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Work Experience</span>
            </div>
          </div>
          <div className="space-y-4">
            {work.map((job, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-xl bg-slate-800/50 border transition-colors ${
                  isEditMode ? 'border-blue-400/30' : 'border-white/10 hover:border-blue-400/30'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    {isEditMode ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={job.title}
                          onChange={(e) => handleUpdateWork(index, 'title', e.target.value)}
                          className="text-lg font-semibold text-blue-100 bg-transparent border-b border-blue-500/30 focus:outline-none focus:border-blue-400 w-full"
                        />
                        <input
                          type="text"
                          value={job.organization}
                          onChange={(e) => handleUpdateWork(index, 'organization', e.target.value)}
                          className="text-sm text-blue-300/70 bg-transparent border-b border-blue-500/20 focus:outline-none focus:border-blue-400 w-full"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-blue-100">{job.title}</h3>
                        <p className="text-sm text-blue-300/70">{job.organization}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditMode ? (
                      <>
                        <input
                          type="number"
                          value={job.startApproxYear}
                          onChange={(e) => handleUpdateWork(index, 'startApproxYear', parseInt(e.target.value))}
                          className="text-xs text-white/40 bg-transparent border-b border-white/20 w-16 text-right"
                        />
                        <span className="text-xs text-white/40">-</span>
                        <input
                          type="text"
                          value={job.endApproxYear || 'Present'}
                          onChange={(e) => handleUpdateWork(index, 'endApproxYear', e.target.value === 'Present' ? null : parseInt(e.target.value))}
                          className="text-xs text-white/40 bg-transparent border-b border-white/20 w-16"
                        />
                      </>
                    ) : (
                      <span className="text-xs text-white/40">
                        {job.startApproxYear} - {job.endApproxYear || 'Present'}
                      </span>
                    )}
                    {isEditMode && (
                      <motion.button
                        onClick={() => handleDeleteWork(index)}
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 ml-2"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
                {isEditMode ? (
                  <input
                    type="text"
                    value={job.industry}
                    onChange={(e) => handleUpdateWork(index, 'industry', e.target.value)}
                    className="text-sm text-white/50 bg-transparent border-b border-white/20 focus:outline-none focus:border-blue-400 w-full mb-3"
                  />
                ) : (
                  <p className="text-sm text-white/50 mb-3">{job.industry}</p>
                )}
                {job.responsibilities && (
                  <ul className="space-y-1">
                    {job.responsibilities.slice(0, 3).map((resp, i) => (
                      <li key={i} className="text-sm text-white/60 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={resp}
                            onChange={(e) => {
                              const newResp = [...job.responsibilities];
                              newResp[i] = e.target.value;
                              handleUpdateWork(index, 'responsibilities', newResp);
                            }}
                            className="flex-1 bg-transparent border-b border-white/10 focus:outline-none focus:border-blue-400"
                          />
                        ) : (
                          resp
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Education</span>
          </div>
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="p-4 rounded-xl bg-slate-800/50 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-purple-100">{edu.field}</h3>
                  <p className="text-sm text-purple-300/70">{edu.institution}</p>
                </div>
                <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                  {edu.durationYears} years
                </span>
              </div>
              <p className="text-sm text-white/60">{edu.notes}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Skills */}
      {((skills.domains?.length ?? 0) > 0 || (skills.technical?.length ?? 0) > 0) && (
        <div>
          <div className="flex items-center gap-2 text-cyan-400 mb-4">
            <Cpu className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Skills</span>
          </div>
          <div className="space-y-3">
            {skills.domains && skills.domains.length > 0 && (
              <div>
                <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Domains</div>
                <div className="flex flex-wrap gap-2">
                  {skills.domains.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-200 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Technical</div>
                <div className="flex flex-wrap gap-2">
                  {skills.technical.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-200/80 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {hydroProject && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">{hydroProject.title}</span>
          </div>
          <p className="text-sm text-emerald-100/70 mb-4">{hydroProject.coreIdea}</p>

          {/* KPI Pills */}
          {hydroProject.businessModel?.capitalStructureExample && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium">
                {hydroProject.businessModel.capitalStructureExample.singleSiteCapacityKW}kW
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium">
                {hydroProject.businessModel.founderCompensation.cashInvestment}% Founder Capital
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium">
                {hydroProject.businessModel.capitalStructureExample.targetPaybackYearsPortfolio}-year Payback
              </span>
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium">
                {(hydroProject.businessModel.capitalStructureExample.targetIRR.min * 100).toFixed(0)}-{(
                  hydroProject.businessModel.capitalStructureExample.targetIRR.max * 100
                ).toFixed(0)}% IRR
              </span>
            </div>
          )}

          <div className="text-xs text-emerald-400/60">
            Status: {hydroProject.status}
          </div>
        </motion.div>
      )}

      {/* Joule Crypto */}
      {jouleCrypto && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-400/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Joule Token</span>
          </div>
          <p className="text-sm text-amber-100/70 mb-3">{jouleCrypto.concept}</p>
          <div className="flex flex-wrap gap-2">
            {jouleCrypto.designPrinciples?.slice(0, 3).map((principle, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs"
              >
                {principle}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Finance */}
      {finance && (
        <motion.div
          className="p-4 rounded-xl bg-slate-800/50 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 text-white/60 mb-3">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wider uppercase">Financial Profile</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/70">{finance.riskAppetite}</span>
            </div>
            {finance.incomeSources && (
              <div className="flex flex-wrap gap-2 mt-2">
                {finance.incomeSources.map((source, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full bg-white/10 text-white/60 text-xs"
                  >
                    {source}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
