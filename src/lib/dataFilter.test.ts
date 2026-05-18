import test from 'node:test';
import assert from 'node:assert';
import { isClusterVisible, getFilteredData } from './dataFilter.ts';
import type { ParisData } from '../types/index.ts';

const mockData: ParisData = {
  userId: 'user123',
  profile: {
    fullName: 'John Doe',
    preferredName: 'Johnny',
    dateOfBirth: '1990-01-01',
    placeOfBirth: { city: 'Paris', country: 'France' },
    gender: 'Male',
    nationality: { mother: 'French', father: 'French' },
    currentLocation: { city: 'Geneva', canton: 'Geneva', country: 'Switzerland', sinceYear: 2020 },
    primaryLanguages: ['French (native)', 'English (fluent)', 'Spanish (basic)'],
    learningLanguages: ['German'],
  },
  lifeTimeline: [
    { period: '2010-2015', location: 'Cameroon', summary: 'Early career' },
    { period: '2015-2018', location: 'United States', summary: 'Studies' },
    { period: '2018-present', location: 'Switzerland', summary: 'Current job' },
    { period: '2000-2010', location: 'France', summary: 'Childhood' },
  ],
  education: [
    { level: 'Masters', field: 'Engineering', institution: 'MIT', country: 'USA', durationYears: 2, status: 'Completed', notes: '' },
  ],
  workExperience: [
    { title: 'Engineer', organization: 'TechCorp', industry: 'Technology', location: 'Geneva', startApproxYear: 2018, endApproxYear: null, responsibilities: ['Coding'], skillsUsed: ['TypeScript'] },
  ],
  skills: {
    domains: ['Engineering', 'Management', 'Design', 'Marketing', 'Sales'],
    technical: ['TypeScript', 'React'],
    softSkills: ['systems thinking', 'strategic planning', 'cross-cultural communication', 'teamwork'],
  },
  interestsAndValues: {
    coreInterests: ['renewable energy', 'algo trading', 'scalable architecture', 'Japanese culture', 'minimalism', 'health', 'travel', 'music', 'random'],
    travel: { countriesVisitedCount: 20, notes: 'Love traveling' },
    values: ['intellectual curiosity', 'simplicity', 'healthspan', 'loyalty'],
    lifestylePreferences: { aesthetic: ['minimalist'], social: ['introvert'] },
  },
  healthAndPerformance: {
    goals: { exercise: 'daily', bodyComposition: 'lean', nutrition: 'balanced', sleep: '8 hours', ageing: 'slow' },
    habits: { movement: 'running', mindset: 'meditation' },
  },
  relationships: {
    maritalStatus: 'Single',
    spouse: { fullName: '', approxAge: 0, profession: '', employer: '', assetsUnderManagement: '', involvementInProjects: '' },
    family: { motherNationality: 'French', fatherNationality: 'French' },
  },
  financeAndWorkstyle: {
    currentRole: 'Senior Engineer',
    incomeSources: ['salary'],
    goals: ['financial independence'],
    riskAppetite: 'Moderate',
    investmentThesisSummary: 'Diversified',
  },
  projects: {
    personalMemoryPlatform: { id: 'p1', title: 'Platform', goal: '', components: [], contexts: [], status: '' },
    hydroPortfolio: {
      id: 'h1', title: 'Hydro', coreIdea: '',
      businessModel: {
        revenueStreams: [],
        founderCompensation: { cashInvestment: 1000, profitShareNet: 10, profitShareDuration: '', roles: [] },
        capitalStructureExample: { singleSiteCapacityKW: 0, capexCHF: 0, debtToEquityRatio: '', targetPaybackYearsPortfolio: 0, targetIRR: { min: 0, max: 0 } }
      },
      status: ''
    },
    jouleCrypto: { id: 'j1', concept: '', designPrinciples: [], status: '' },
  },
  learningAndRoadmap: {
    currentLearningFocus: [],
    futureLearningIdeas: [],
    certificationsTargeted: [],
  },
  personalityModel: {
    selfDescription: [],
    decisionStyle: '',
    socialEnergy: '',
  },
};

test('isClusterVisible - WORK context', () => {
  assert.strictEqual(isClusterVisible('expertise', 'WORK'), true);
  assert.strictEqual(isClusterVisible('timeline', 'WORK'), true);
  assert.strictEqual(isClusterVisible('places', 'WORK'), true);
  assert.strictEqual(isClusterVisible('genealogy', 'WORK'), false);
  assert.strictEqual(isClusterVisible('music', 'WORK'), false);
});

test('isClusterVisible - DATING context', () => {
  assert.strictEqual(isClusterVisible('genealogy', 'DATING'), true);
  assert.strictEqual(isClusterVisible('music', 'DATING'), true);
  assert.strictEqual(isClusterVisible('places', 'DATING'), true);
  assert.strictEqual(isClusterVisible('expertise', 'DATING'), false);
  assert.strictEqual(isClusterVisible('timeline', 'DATING'), false);
});

test('isClusterVisible - PUBLIC context', () => {
  assert.strictEqual(isClusterVisible('expertise', 'PUBLIC'), true);
  assert.strictEqual(isClusterVisible('places', 'PUBLIC'), true);
  assert.strictEqual(isClusterVisible('timeline', 'PUBLIC'), true);
  assert.strictEqual(isClusterVisible('genealogy', 'PUBLIC'), false);
  assert.strictEqual(isClusterVisible('music', 'PUBLIC'), false);
});

test('isClusterVisible - PRIVATE context', () => {
  assert.strictEqual(isClusterVisible('any_cluster', 'PRIVATE'), true);
  assert.strictEqual(isClusterVisible('music', 'PRIVATE'), true);
  assert.strictEqual(isClusterVisible('expertise', 'PRIVATE'), true);
});

test('isClusterVisible - default/other contexts', () => {
  // @ts-ignore - testing default case for unexpected context types
  assert.strictEqual(isClusterVisible('music', 'FAMILY' as any), true);
  // @ts-ignore
  assert.strictEqual(isClusterVisible('any', 'UNKNOWN' as any), true);
});

const mockParisData: ParisData = {
  userId: "123",
  profile: {
    fullName: "John Doe",
    preferredName: "John",
    dateOfBirth: "1990-01-01",
    placeOfBirth: "Paris, France",
    nationality: "French",
    currentLocation: "New York, USA",
    primaryLanguages: ["native English", "fluent French", "basic Spanish"],
    learningLanguages: ["Japanese"],
  },
  lifeTimeline: [
    { period: "2015-2018", location: "Cameroon", event: "Work", category: "work" },
    { period: "2018-present", location: "United States", event: "Study", category: "education" },
    { period: "2020-2022", location: "Switzerland", event: "Travel", category: "life" },
    { period: "2023", location: "Japan", event: "Vacation", category: "life" },
  ],
  education: [
    { institution: "University X", degree: "BS", field: "CS", startYear: 2008, endYear: 2012, description: "Desc" }
  ],
  workExperience: [
    { title: "Engineer", organization: "Tech Corp", location: "NY", industry: "Tech", startYear: 2012, endYear: 2020, description: "Desc" }
  ],
  skills: {
    domains: ["Engineering", "Product", "Design", "Marketing"],
    technical: ["React", "Node", "TypeScript"],
    softSkills: ["systems thinking", "strategic planning", "cross-cultural communication", "public speaking"]
  },
  interestsAndValues: {
    coreInterests: ["renewable energy", "algorithmic trading", "scalable systems", "Japanese culture", "minimalism", "health optimization", "travel", "music production"],
    travel: { countriesVisitedCount: 30, notes: "Love exploring" },
    values: ["curiosity", "simplicity", "health first", "honesty"],
    lifestylePreferences: ["early bird", "vegetarian"]
  },
  healthAndPerformance: {
    goals: ["run a marathon"],
    habits: ["daily meditation"],
  } as any,
  relationships: {
    maritalStatus: "Single",
  } as any,
  projects: {
    hydroPortfolio: {
      name: "Hydro",
      businessModel: {
        revenue: 1000,
        founderCompensation: 100,
      }
    },
    jouleCrypto: {
      name: "Joule"
    }
  } as any,
  financeAndWorkstyle: {
    currentRole: "Lead",
    riskAppetite: "Moderate",
  } as any,
  learningAndRoadmap: {
    currentLearningFocus: [],
    futureLearningIdeas: [],
    certificationsTargeted: [],
  }
};

test('getFilteredData - WORK context', () => {
  const result = getFilteredData(mockParisData, 'WORK');

  assert.deepStrictEqual(result.profile, {
    preferredName: "John",
    currentLocation: "New York, USA",
    primaryLanguages: ["native English", "fluent French", "basic Spanish"],
  });

  assert.strictEqual(result.timeline.length, 3);
  assert.strictEqual(result.timeline[0].location, "Cameroon");
  assert.strictEqual(result.timeline[1].location, "United States");
  assert.strictEqual(result.timeline[2].location, "Switzerland");

  assert.strictEqual(result.education, mockParisData.education);
  assert.strictEqual(result.workExperience, mockParisData.workExperience);

  assert.strictEqual(result.skills.domains, mockParisData.skills.domains);
  assert.strictEqual(result.skills.technical, mockParisData.skills.technical);
  assert.deepStrictEqual(result.skills.softSkills, ["systems thinking", "strategic planning", "cross-cultural communication"]);

  assert.deepStrictEqual(result.interests.coreInterests, ["renewable energy", "algorithmic trading", "scalable systems"]);
  assert.deepStrictEqual(result.health, {});
  assert.deepStrictEqual(result.relationships, { maritalStatus: "Single" });

  assert.strictEqual(result.projects.hydroPortfolio, mockParisData.projects.hydroPortfolio);
  assert.strictEqual(result.projects.jouleCrypto, mockParisData.projects.jouleCrypto);

  assert.deepStrictEqual(result.finance, { currentRole: "Lead", riskAppetite: "Moderate" });
});

test('getFilteredData - DATING context', () => {
  const result = getFilteredData(mockParisData, 'DATING');

  assert.deepStrictEqual(result.profile, {
    fullName: "John Doe",
    preferredName: "John",
    dateOfBirth: "1990-01-01",
    placeOfBirth: "Paris, France",
    nationality: "French",
    currentLocation: "New York, USA",
    primaryLanguages: ["native English", "fluent French", "basic Spanish"],
    learningLanguages: ["Japanese"],
  });

  assert.strictEqual(result.timeline, mockParisData.lifeTimeline);
  assert.deepStrictEqual(result.education, []);
  assert.deepStrictEqual(result.workExperience, [{ title: "Engineer", organization: "Tech Corp", location: "NY" }]);

  assert.deepStrictEqual(result.skills, {});

  assert.deepStrictEqual(result.interests.coreInterests, ["Japanese culture", "minimalism", "health optimization", "travel", "music production"]);
  assert.strictEqual(result.interests.travel, mockParisData.interestsAndValues.travel);
  assert.deepStrictEqual(result.interests.values, ["curiosity", "simplicity", "health first"]);
  assert.strictEqual(result.interests.lifestylePreferences, mockParisData.interestsAndValues.lifestylePreferences);

  assert.deepStrictEqual(result.health, mockParisData.healthAndPerformance);
  assert.deepStrictEqual(result.relationships, { maritalStatus: "Single" });
  assert.deepStrictEqual(result.projects, {});
  assert.strictEqual(result.finance, undefined);
});

test('getFilteredData - PUBLIC context', () => {
  const result = getFilteredData(mockParisData, 'PUBLIC');

  assert.deepStrictEqual(result.profile, {
    preferredName: "John",
    currentLocation: "New York, USA",
    primaryLanguages: ["native English", "fluent French"],
  });

  assert.strictEqual(result.timeline.length, 2);
  assert.strictEqual(result.timeline[0].period, "2015-2018");
  assert.strictEqual(result.timeline[1].period, "2018-present");

  assert.deepStrictEqual(result.education, []);
  assert.deepStrictEqual(result.workExperience, [{ title: "Engineer", organization: "Tech Corp", industry: "Tech" }]);

  assert.deepStrictEqual(result.skills, { domains: ["Engineering", "Product", "Design"] });

  assert.deepStrictEqual(result.interests.coreInterests, ["renewable energy", "algorithmic trading", "scalable systems", "Japanese culture"]);
  assert.deepStrictEqual(result.interests.travel, mockParisData.interestsAndValues.travel);

  assert.deepStrictEqual(result.health, {});
  assert.deepStrictEqual(result.relationships, {});

  assert.deepStrictEqual(result.projects, {
    hydroPortfolio: {
      name: "Hydro",
      businessModel: {
        revenue: 1000,
        founderCompensation: undefined,
      }
    }
  });

  assert.strictEqual(result.finance, undefined);
});

test('getFilteredData - PRIVATE context', () => {
  const result = getFilteredData(mockParisData, 'PRIVATE');

  assert.strictEqual(result.profile, mockParisData.profile);
  assert.strictEqual(result.timeline, mockParisData.lifeTimeline);
  assert.strictEqual(result.education, mockParisData.education);
  assert.strictEqual(result.workExperience, mockParisData.workExperience);
  assert.strictEqual(result.skills, mockParisData.skills);
  assert.strictEqual(result.interests, mockParisData.interestsAndValues);
  assert.strictEqual(result.health, mockParisData.healthAndPerformance);
  assert.strictEqual(result.relationships, mockParisData.relationships);
  assert.strictEqual(result.projects, mockParisData.projects);
  assert.strictEqual(result.finance, mockParisData.financeAndWorkstyle);
});

test('getFilteredData - default context', () => {
  // @ts-ignore
  const result = getFilteredData(mockParisData, 'UNKNOWN');
  const expected = getFilteredData(mockParisData, 'PUBLIC');

  assert.deepStrictEqual(result, expected);
});
