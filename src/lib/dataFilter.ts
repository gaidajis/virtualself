import type { ParisData, FilteredData, ContextType } from '@/types';

export function getFilteredData(data: ParisData, context: ContextType): FilteredData {
  switch (context) {
    case 'WORK':
      return filterWorkContext(data);
    case 'DATING':
      return filterDatingContext(data);
    case 'PRIVATE':
      return filterPrivateContext(data);
    case 'PUBLIC':
    default:
      return filterPublicContext(data);
  }
}

function filterWorkContext(data: ParisData): FilteredData {
  return {
    profile: {
      preferredName: data.profile.preferredName,
      currentLocation: data.profile.currentLocation,
      primaryLanguages: data.profile.primaryLanguages,
    },
    timeline: data.lifeTimeline.filter(event => 
      event.location.includes('Cameroon') ||
      event.location.includes('United States') ||
      event.location.includes('Switzerland')
    ),
    education: data.education,
    workExperience: data.workExperience,
    skills: {
      domains: data.skills.domains,
      technical: data.skills.technical,
      softSkills: data.skills.softSkills.filter(skill => 
        skill.includes('systems') || skill.includes('strategic') || skill.includes('cross-cultural')
      ),
    },
    interests: {
      coreInterests: data.interestsAndValues.coreInterests.filter(interest =>
        interest.includes('energy') || 
        interest.includes('trading') ||
        interest.includes('scalable')
      ),
    },
    health: {},
    relationships: {
      maritalStatus: data.relationships.maritalStatus,
    },
    projects: {
      hydroPortfolio: data.projects.hydroPortfolio,
      jouleCrypto: data.projects.jouleCrypto,
    },
    finance: {
      currentRole: data.financeAndWorkstyle.currentRole,
      riskAppetite: data.financeAndWorkstyle.riskAppetite,
    },
  };
}

function filterDatingContext(data: ParisData): FilteredData {
  return {
    profile: {
      fullName: data.profile.fullName,
      preferredName: data.profile.preferredName,
      dateOfBirth: data.profile.dateOfBirth,
      placeOfBirth: data.profile.placeOfBirth,
      nationality: data.profile.nationality,
      currentLocation: data.profile.currentLocation,
      primaryLanguages: data.profile.primaryLanguages,
      learningLanguages: data.profile.learningLanguages,
    },
    timeline: data.lifeTimeline,
    education: [],
    workExperience: data.workExperience.map(work => ({
      title: work.title,
      organization: work.organization,
      location: work.location,
    })) as any,
    skills: {},
    interests: {
      coreInterests: data.interestsAndValues.coreInterests.filter(interest =>
        interest.includes('Japanese') ||
        interest.includes('minimalism') ||
        interest.includes('health') ||
        interest.includes('travel') ||
        interest.includes('music')
      ),
      travel: data.interestsAndValues.travel,
      values: data.interestsAndValues.values.filter(value =>
        value.includes('curiosity') ||
        value.includes('simplicity') ||
        value.includes('health')
      ),
      lifestylePreferences: data.interestsAndValues.lifestylePreferences,
    },
    health: {
      goals: data.healthAndPerformance.goals,
      habits: data.healthAndPerformance.habits,
    },
    relationships: {
      maritalStatus: data.relationships.maritalStatus,
    },
    projects: {},
  };
}

function filterPublicContext(data: ParisData): FilteredData {
  return {
    profile: {
      preferredName: data.profile.preferredName,
      currentLocation: data.profile.currentLocation,
      primaryLanguages: data.profile.primaryLanguages.filter(lang => 
        lang.includes('native') || lang.includes('fluent')
      ),
    },
    timeline: data.lifeTimeline.filter(event =>
      event.period.includes('present') || event.period.includes('2018')
    ),
    education: [],
    workExperience: data.workExperience.map(work => ({
      title: work.title,
      organization: work.organization,
      industry: work.industry,
    })) as any,
    skills: {
      domains: data.skills.domains.slice(0, 3),
    },
    interests: {
      coreInterests: data.interestsAndValues.coreInterests.slice(0, 4),
      travel: {
        countriesVisitedCount: data.interestsAndValues.travel.countriesVisitedCount,
        notes: data.interestsAndValues.travel.notes,
      },
    },
    health: {},
    relationships: {},
    projects: {
      hydroPortfolio: {
        ...data.projects.hydroPortfolio,
        businessModel: {
          ...data.projects.hydroPortfolio.businessModel,
          founderCompensation: undefined,
        },
      } as any,
    },
  };
}

function filterPrivateContext(data: ParisData): FilteredData {
  return {
    profile: data.profile,
    timeline: data.lifeTimeline,
    education: data.education,
    workExperience: data.workExperience,
    skills: data.skills,
    interests: data.interestsAndValues,
    health: data.healthAndPerformance,
    relationships: data.relationships,
    projects: data.projects,
    finance: data.financeAndWorkstyle,
  };
}

// Helper to check if a cluster should be visible in current context
export function isClusterVisible(cluster: string, context: ContextType): boolean {
  switch (context) {
    case 'WORK':
      return ['expertise', 'timeline', 'places'].includes(cluster);
    case 'DATING':
      return ['genealogy', 'music', 'places'].includes(cluster);
    case 'PUBLIC':
      return ['expertise', 'places', 'timeline'].includes(cluster);
    case 'PRIVATE':
      return true;
    default:
      return true;
  }
}

// Helper to get cluster opacity based on context
export function getClusterOpacity(cluster: string, context: ContextType): number {
  if (context === 'PRIVATE') return 1;
  if (isClusterVisible(cluster, context)) return 1;
  return 0.3;
}
