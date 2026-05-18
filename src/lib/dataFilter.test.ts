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

test('getFilteredData - WORK context', () => {
  const result = getFilteredData(mockData, 'WORK');

  assert.deepStrictEqual(result.profile, {
    preferredName: 'Johnny',
    currentLocation: mockData.profile.currentLocation,
    primaryLanguages: mockData.profile.primaryLanguages,
  });

  assert.strictEqual(result.timeline.length, 3); // Cameroon, US, Switzerland matches
  assert.strictEqual(result.timeline[0].location, 'Cameroon');

  assert.deepStrictEqual(result.education, mockData.education);
  assert.deepStrictEqual(result.workExperience, mockData.workExperience);

  assert.deepStrictEqual(result.skills.domains, mockData.skills.domains);
  assert.deepStrictEqual(result.skills.technical, mockData.skills.technical);
  assert.strictEqual(result.skills.softSkills?.length, 3); // systems, strategic, cross-cultural

  assert.strictEqual(result.interests.coreInterests?.length, 3); // renewable energy, algo trading, scalable architecture

  assert.deepStrictEqual(result.health, {});

  assert.deepStrictEqual(result.relationships, { maritalStatus: 'Single' });

  assert.deepStrictEqual(result.projects.hydroPortfolio, mockData.projects.hydroPortfolio);
  assert.deepStrictEqual(result.projects.jouleCrypto, mockData.projects.jouleCrypto);

  assert.deepStrictEqual(result.finance, {
    currentRole: 'Senior Engineer',
    riskAppetite: 'Moderate',
  });
});

test('getFilteredData - DATING context', () => {
  const result = getFilteredData(mockData, 'DATING');

  assert.deepStrictEqual(result.profile, {
    fullName: 'John Doe',
    preferredName: 'Johnny',
    dateOfBirth: '1990-01-01',
    placeOfBirth: { city: 'Paris', country: 'France' },
    nationality: { mother: 'French', father: 'French' },
    currentLocation: mockData.profile.currentLocation,
    primaryLanguages: mockData.profile.primaryLanguages,
    learningLanguages: ['German'],
  });

  assert.deepStrictEqual(result.timeline, mockData.lifeTimeline);
  assert.deepStrictEqual(result.education, []);

  assert.deepStrictEqual(result.workExperience, [
    { title: 'Engineer', organization: 'TechCorp', location: 'Geneva' }
  ]);

  assert.deepStrictEqual(result.skills, {});

  assert.strictEqual(result.interests.coreInterests?.length, 5); // Japanese culture, minimalism, health, travel, music
  assert.deepStrictEqual(result.interests.travel, mockData.interestsAndValues.travel);
  assert.strictEqual(result.interests.values?.length, 3); // curiosity, simplicity, healthspan
  assert.deepStrictEqual(result.interests.lifestylePreferences, mockData.interestsAndValues.lifestylePreferences);

  assert.deepStrictEqual(result.health, mockData.healthAndPerformance);
  assert.deepStrictEqual(result.relationships, { maritalStatus: 'Single' });
  assert.deepStrictEqual(result.projects, {});
});

test('getFilteredData - PUBLIC context', () => {
  const result = getFilteredData(mockData, 'PUBLIC');

  assert.deepStrictEqual(result.profile, {
    preferredName: 'Johnny',
    currentLocation: mockData.profile.currentLocation,
    primaryLanguages: ['French (native)', 'English (fluent)'], // Basic Spanish should be filtered out
  });

  assert.strictEqual(result.timeline.length, 2); // '2015-2018' and '2018-present' match '2018' or 'present'
  assert.strictEqual(result.timeline[0].period, '2015-2018');
  assert.strictEqual(result.timeline[1].period, '2018-present');

  assert.deepStrictEqual(result.education, []);

  assert.deepStrictEqual(result.workExperience, [
    { title: 'Engineer', organization: 'TechCorp', industry: 'Technology' }
  ]);

  assert.deepStrictEqual(result.skills, {
    domains: ['Engineering', 'Management', 'Design'], // First 3 only
  });

  assert.strictEqual(result.interests.coreInterests?.length, 4); // First 4 only
  assert.deepStrictEqual(result.interests.travel, {
    countriesVisitedCount: 20,
    notes: 'Love traveling',
  });

  assert.deepStrictEqual(result.health, {});
  assert.deepStrictEqual(result.relationships, {});

  // Checking that founderCompensation is undefined
  assert.strictEqual(result.projects.hydroPortfolio?.businessModel?.founderCompensation, undefined);
  assert.strictEqual(result.projects.hydroPortfolio?.title, 'Hydro');
});

test('getFilteredData - PRIVATE context', () => {
  const result = getFilteredData(mockData, 'PRIVATE');

  // Private context returns everything
  assert.deepStrictEqual(result.profile, mockData.profile);
  assert.deepStrictEqual(result.timeline, mockData.lifeTimeline);
  assert.deepStrictEqual(result.education, mockData.education);
  assert.deepStrictEqual(result.workExperience, mockData.workExperience);
  assert.deepStrictEqual(result.skills, mockData.skills);
  assert.deepStrictEqual(result.interests, mockData.interestsAndValues);
  assert.deepStrictEqual(result.health, mockData.healthAndPerformance);
  assert.deepStrictEqual(result.relationships, mockData.relationships);
  assert.deepStrictEqual(result.projects, mockData.projects);
  assert.deepStrictEqual(result.finance, mockData.financeAndWorkstyle);
});

test('getFilteredData - default/unknown context', () => {
  // @ts-ignore - testing default case
  const result = getFilteredData(mockData, 'UNKNOWN' as any);
  const publicResult = getFilteredData(mockData, 'PUBLIC');

  // Should default to PUBLIC filtering
  assert.deepStrictEqual(result, publicResult);
});
