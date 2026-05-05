// Context types for filtering data
export type ContextType = 'PUBLIC' | 'DATING' | 'WORK' | 'PRIVATE';

// Cluster types for the orbiting nodes
export type ClusterType = 'timeline' | 'music' | 'places' | 'expertise' | 'genealogy' | null;

// Paris.json data types
export interface Profile {
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  placeOfBirth: {
    city: string;
    country: string;
  };
  gender: string;
  nationality: {
    mother: string;
    father: string;
  };
  currentLocation: {
    city: string;
    canton: string;
    country: string;
    sinceYear: number;
  };
  primaryLanguages: string[];
  learningLanguages: string[];
}

export interface LifeTimelineEvent {
  period: string;
  ageRange?: string;
  location: string;
  summary: string;
}

export interface Education {
  level: string;
  field: string;
  institution: string;
  country: string;
  durationYears: number;
  status: string;
  notes: string;
}

export interface WorkExperience {
  title: string;
  organization: string;
  industry: string;
  location: string;
  startApproxYear: number;
  endApproxYear: number | null;
  responsibilities: string[];
  skillsUsed: string[];
}

export interface Skills {
  domains: string[];
  technical: string[];
  softSkills: string[];
}

export interface InterestsAndValues {
  coreInterests: string[];
  travel: {
    countriesVisitedCount: number;
    notes: string;
  };
  values: string[];
  lifestylePreferences: {
    aesthetic: string[];
    social: string[];
  };
}

export interface HealthAndPerformance {
  goals: {
    exercise: string;
    bodyComposition: string;
    nutrition: string;
    sleep: string;
    ageing: string;
  };
  habits: {
    movement: string;
    mindset: string;
  };
}

export interface Spouse {
  fullName: string;
  approxAge: number;
  profession: string;
  employer: string;
  assetsUnderManagement: string;
  involvementInProjects: string;
}

export interface Relationships {
  maritalStatus: string;
  spouse: Spouse;
  family: {
    motherNationality: string;
    fatherNationality: string;
  };
}

export interface HydroPortfolio {
  id: string;
  title: string;
  coreIdea: string;
  businessModel: {
    revenueStreams: string[];
    founderCompensation: {
      cashInvestment: number;
      profitShareNet: number;
      profitShareDuration: string;
      roles: string[];
    };
    capitalStructureExample: {
      singleSiteCapacityKW: number;
      capexCHF: number;
      debtToEquityRatio: string;
      targetPaybackYearsPortfolio: number;
      targetIRR: {
        min: number;
        max: number;
      };
    };
  };
  status: string;
}

export interface JouleCrypto {
  id: string;
  concept: string;
  designPrinciples: string[];
  status: string;
}

export interface PersonalMemoryPlatform {
  id: string;
  title: string;
  goal: string;
  components: string[];
  contexts: string[];
  status: string;
}

export interface Projects {
  personalMemoryPlatform: PersonalMemoryPlatform;
  hydroPortfolio: HydroPortfolio;
  jouleCrypto: JouleCrypto;
}

export interface FinanceAndWorkstyle {
  currentRole: string;
  incomeSources: string[];
  goals: string[];
  riskAppetite: string;
  investmentThesisSummary: string;
}

export interface ParisData {
  userId: string;
  profile: Profile;
  lifeTimeline: LifeTimelineEvent[];
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skills;
  interestsAndValues: InterestsAndValues;
  healthAndPerformance: HealthAndPerformance;
  relationships: Relationships;
  financeAndWorkstyle: FinanceAndWorkstyle;
  projects: Projects;
  learningAndRoadmap: {
    currentLearningFocus: string[];
    futureLearningIdeas: string[];
    certificationsTargeted: string[];
  };
}

// Filtered data structure for each context
export interface FilteredData {
  profile: Partial<Profile>;
  timeline: LifeTimelineEvent[];
  education: Education[];
  workExperience: WorkExperience[];
  skills: Partial<Skills>;
  interests: Partial<InterestsAndValues>;
  health: Partial<HealthAndPerformance>;
  relationships: Partial<Relationships>;
  projects: Partial<Projects>;
  finance?: Partial<FinanceAndWorkstyle>;
}
