// Context types for filtering data - Extended for virtualself
export type ContextType = 'PUBLIC' | 'DATING' | 'WORK' | 'PRIVATE' | 'FAMILY' | 'STUDENT' | 'MEMORY' | 'ANCESTRY' | 'EDIT' | 'ZOOM_HELP';

// Cluster types for the orbiting nodes - Extended
export type ClusterType = 'timeline' | 'music' | 'places' | 'expertise' | 'genealogy' | 'learning' | 'health' | 'relationships' | null;

// Entity types for the identity graph
export type EntityType = 
  | 'person'
  | 'profile'
  | 'memory'
  | 'timelineEvent'
  | 'place'
  | 'trip'
  | 'residence'
  | 'educationRecord'
  | 'course'
  | 'exam'
  | 'workRole'
  | 'project'
  | 'subProject'
  | 'skill'
  | 'interest'
  | 'value'
  | 'goal'
  | 'habit'
  | 'relationship'
  | 'relationshipEvent'
  | 'familyMember'
  | 'ancestryNode'
  | 'document'
  | 'photo'
  | 'audioNote'
  | 'playlist'
  | 'healthMetric'
  | 'collection'
  | 'contextView'
  | 'connectionEdge'
  | 'permissionGrant'
  | 'narration'
  | 'revision'
  | 'tag';

// Permission scopes for access control
export type PermissionScope = 
  | 'public'
  | 'authenticated'
  | 'approved_connection'
  | 'family_only'
  | 'partner_only'
  | 'work_network_only'
  | 'alumni_network_only'
  | 'private'
  | 'strict_private';

// Connection status for consent-based relationships
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'revoked' | 'blocked';

// Relationship types
export type RelationshipType = 
  | 'spouse'
  | 'partner'
  | 'sibling'
  | 'friend'
  | 'collaborator'
  | 'classmate'
  | 'manager'
  | 'mentor'
  | 'family_branch'
  | 'project_partner'
  | 'parent'
  | 'child'
  | 'grandparent'
  | 'grandchild'
  | 'uncle_aunt'
  | 'cousin'
  | 'other';

// Confidence levels for uncertain data
export type ConfidenceLevel = 'confirmed' | 'high' | 'medium' | 'low' | 'inferred' | 'disputed' | 'obsolete';

// Narration tone
export type NarrationTone = 'warm' | 'neutral' | 'reflective' | 'professional' | 'playful';

// Narration speaker type
export type NarrationSpeaker = 'self' | 'thirdPerson' | 'system';

// Position interface
export interface Position {
  x: number;
  y: number;
}

// Theme interface
export interface Theme {
  primary: string;
  accent: string;
  gradient: string;
}

// Photo interface - extended
export interface Photo {
  id: string;
  url: string;
  caption?: string;
  order: number;
  entityId?: string;
  entityType?: EntityType;
  tags?: string[];
  visibility?: PermissionScope;
  createdAt?: string;
}

// Media attachment interface
export interface MediaAttachment {
  id: string;
  type: 'photo' | 'document' | 'audio' | 'video' | 'link';
  url: string;
  title?: string;
  description?: string;
  entityId: string;
  entityType: EntityType;
  uploadedAt: string;
  visibility: PermissionScope;
}

// Tag interface
export interface Tag {
  id: string;
  name: string;
  color?: string;
  category?: string;
}

// Narration interface
export interface Narration {
  id: string;
  entityId: string;
  entityType: EntityType;
  speaker: NarrationSpeaker;
  title: string;
  summary: string;
  story: string;
  tone?: NarrationTone;
  contextTags: ContextType[];
  visibility: PermissionScope;
  audioUrl?: string;
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

// Revision history interface
export interface Revision {
  id: string;
  entityId: string;
  entityType: EntityType;
  version: number;
  editedBy: string;
  editedAt: string;
  changeReason?: string;
  previousValues: Record<string, any>;
  newValues: Record<string, any>;
}

// Permission grant interface
export interface PermissionGrant {
  id: string;
  grantedToUserId: string;
  grantedByUserId: string;
  scope: PermissionScope;
  entityIds?: string[]; // specific entities, or all if undefined
  entityType?: EntityType;
  createdAt: string;
  expiresAt?: string;
  revokedAt?: string;
}

// Connection edge interface - for consent-based profile connections
export interface ConnectionEdge {
  id: string;
  fromUserId: string;
  toUserId: string;
  relationshipType: RelationshipType;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    description?: string;
    startedAt?: string;
    endedAt?: string;
    sharedMemories?: string[];
    sharedProjects?: string[];
  };
  permissions: PermissionScope[];
}

// Base entity interface - all entities extend this
export interface BaseEntity {
  id: string;
  type: EntityType;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  visibility: PermissionScope;
  tags?: string[];
  narrations?: Narration[];
  media?: MediaAttachment[];
  customFields?: Record<string, any>;
}

// Memory interface
export interface Memory extends BaseEntity {
  type: 'memory';
  title: string;
  description: string;
  date?: string;
  dateApproximate?: boolean;
  location?: string;
  placeId?: string;
  peopleInvolved?: string[]; // person IDs
  relatedEvents?: string[]; // event IDs
  emotionalTags?: string[];
  confidence: ConfidenceLevel;
  sourceReferences?: string[];
  isUserConfirmed: boolean;
}

// Timeline event interface
export interface TimelineEvent extends BaseEntity {
  type: 'timelineEvent';
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  placeId?: string;
  peopleInvolved?: string[];
  category: 'personal' | 'professional' | 'educational' | 'travel' | 'family' | 'health' | 'other';
  icon?: string;
  confidence: ConfidenceLevel;
}

// Place interface
export interface Place extends BaseEntity {
  type: 'place';
  name: string;
  placeType: 'birth_place' | 'residence' | 'work' | 'school' | 'travel' | 'favorite' | 'emotional' | 'family_origin' | 'other';
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  coordinates?: { lat: number; lng: number };
  dateRange?: { start: string; end: string };
  memories?: string[]; // memory IDs
  peopleConnected?: string[]; // person IDs
  projects?: string[]; // project IDs
  description?: string;
  significance?: string;
}

// Trip interface
export interface Trip extends BaseEntity {
  type: 'trip';
  title: string;
  destination: string;
  placeId?: string;
  startDate: string;
  endDate: string;
  purpose?: string;
  companions?: string[]; // person IDs
  memories?: string[]; // memory IDs
  photos?: string[]; // photo IDs
  notes?: string;
}

// Residence interface
export interface Residence extends BaseEntity {
  type: 'residence';
  placeId?: string;
  address?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  residenceType: 'owned' | 'rented' | 'family' | 'temporary' | 'other';
  memories?: string[];
}

// Education record interface
export interface EducationRecord extends BaseEntity {
  type: 'educationRecord';
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  status: 'complete' | 'incomplete' | 'ongoing' | 'dropped';
  location?: string;
  grades?: string;
  achievements?: string[];
  courses?: string[]; // course IDs
  advisors?: string[]; // person IDs
  peers?: string[]; // person IDs
  description?: string;
}

// Course interface
export interface Course extends BaseEntity {
  type: 'course';
  title: string;
  institution?: string;
  educationRecordId?: string;
  startDate?: string;
  endDate?: string;
  credits?: number;
  grade?: string;
  instructor?: string;
  description?: string;
  topics?: string[];
}

// Exam interface
export interface Exam extends BaseEntity {
  type: 'exam';
  title: string;
  courseId?: string;
  educationRecordId?: string;
  date: string;
  score?: number;
  maxScore?: number;
  grade?: string;
  description?: string;
}

// Work role interface
export interface WorkRole extends BaseEntity {
  type: 'workRole';
  title: string;
  organization: string;
  industry?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  responsibilities?: string[];
  achievements?: string[];
  skillsUsed?: string[];
  projects?: string[]; // project IDs
  collaborators?: string[]; // person IDs
  description?: string;
}

// Project interface
export interface Project extends BaseEntity {
  type: 'project';
  title: string;
  description: string;
  category: 'work' | 'personal' | 'open_source' | 'research' | 'creative' | 'entrepreneurial' | 'other';
  startDate?: string;
  endDate?: string;
  isOngoing: boolean;
  outcomes?: string[];
  kpis?: { name: string; value: string; target?: string }[];
  tools?: string[];
  repositories?: string[];
  documents?: string[];
  collaborators?: string[]; // person IDs
  skills?: string[]; // skill IDs
  places?: string[]; // place IDs
  subProjects?: string[]; // sub-project IDs
  visibility: PermissionScope;
  nextSteps?: string[];
}

// Skill interface
export interface Skill extends BaseEntity {
  type: 'skill';
  name: string;
  category: 'technical' | 'soft' | 'creative' | 'physical' | 'other';
  level?: number; // 1-5
  yearsExperience?: number;
  lastUsed?: string;
  relatedProjects?: string[];
  certifications?: string[];
  description?: string;
}

// Interest interface
export interface Interest extends BaseEntity {
  type: 'interest';
  name: string;
  category: string;
  description?: string;
  intensity?: 'casual' | 'moderate' | 'passionate' | 'obsessive';
  startedAt?: string;
  relatedPeople?: string[];
  relatedPlaces?: string[];
}

// Value interface
export interface Value extends BaseEntity {
  type: 'value';
  name: string;
  description?: string;
  priority: number; // 1-10
  origin?: string;
  examples?: string[];
}

// Goal interface
export interface Goal extends BaseEntity {
  type: 'goal';
  title: string;
  description?: string;
  category: 'health' | 'career' | 'personal' | 'financial' | 'learning' | 'relationship' | 'other';
  priority: number; // 1-10
  targetDate?: string;
  progress?: number; // 0-100
  milestones?: { title: string; completed: boolean; completedAt?: string }[];
  relatedHabits?: string[];
  isCompleted: boolean;
  completedAt?: string;
}

// Habit interface
export interface Habit extends BaseEntity {
  type: 'habit';
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  frequencyDetail?: string;
  streak?: number;
  longestStreak?: number;
  lastPerformed?: string;
  category: 'health' | 'productivity' | 'mindfulness' | 'learning' | 'other';
  goalId?: string;
}

// Relationship interface
export interface Relationship extends BaseEntity {
  type: 'relationship';
  personId: string; // ID of the connected person
  relationshipType: RelationshipType;
  description?: string;
  startedAt?: string;
  endedAt?: string;
  isCurrent: boolean;
  events?: string[]; // relationship event IDs
  sharedMemories?: string[];
  notes?: string;
  visibility: PermissionScope;
}

// Relationship event interface
export interface RelationshipEvent extends BaseEntity {
  type: 'relationshipEvent';
  relationshipId: string;
  title: string;
  description?: string;
  date: string;
  eventType: 'meeting' | 'milestone' | 'conflict' | 'resolution' | 'celebration' | 'other';
  memories?: string[];
}

// Family member interface
export interface FamilyMember extends BaseEntity {
  type: 'familyMember';
  personId: string;
  relationshipType: 'parent' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'uncle_aunt' | 'cousin' | 'spouse' | 'partner' | 'other';
  name: string;
  birthDate?: string;
  deathDate?: string;
  occupation?: string;
  location?: string;
  bio?: string;
  photos?: string[];
  stories?: string[]; // memory IDs
  ancestryNodeId?: string;
}

// Ancestry node interface
export interface AncestryNode extends BaseEntity {
  type: 'ancestryNode';
  name: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  generation: number; // 0 = self, -1 = parents, -2 = grandparents, etc.
  parents?: string[]; // ancestry node IDs
  children?: string[]; // ancestry node IDs
  spouses?: string[]; // ancestry node IDs
  migrationPaths?: { from: string; to: string; year?: number }[];
  culturalIdentities?: string[];
  stories?: string[]; // memory IDs
  confidence: ConfidenceLevel;
}

// Document interface
export interface Document extends BaseEntity {
  type: 'document';
  title: string;
  url: string;
  fileType: 'pdf' | 'doc' | 'xls' | 'ppt' | 'txt' | 'other';
  category?: string;
  description?: string;
  relatedEntities?: { id: string; type: EntityType }[];
}

// Audio note interface
export interface AudioNote extends BaseEntity {
  type: 'audioNote';
  title: string;
  url: string;
  durationSeconds: number;
  transcript?: string;
  recordedAt: string;
  relatedEntities?: { id: string; type: EntityType }[];
  mood?: string;
}

// Playlist interface
export interface Playlist extends BaseEntity {
  type: 'playlist';
  title: string;
  description?: string;
  tracks: { title: string; artist: string; url?: string; order: number }[];
  mood?: string;
  occasion?: string;
}

// Health metric interface
export interface HealthMetric extends BaseEntity {
  type: 'healthMetric';
  metricType: 'weight' | 'body_fat' | 'muscle_mass' | 'sleep' | 'heart_rate' | 'blood_pressure' | 'exercise' | 'nutrition' | 'mood' | 'energy' | 'other';
  value: number;
  unit: string;
  recordedAt: string;
  notes?: string;
  goal?: { min: number; max: number };
}

// Collection interface - for grouping related entities
export interface Collection extends BaseEntity {
  type: 'collection';
  title: string;
  description?: string;
  entityIds: string[];
  entityTypes: EntityType[];
  isPublic: boolean;
}

// Context view interface - filtered view of profile
export interface ContextView {
  id: string;
  context: ContextType;
  name: string;
  description: string;
  visibleSections: string[];
  sectionFilters: Record<string, Record<string, any>>;
  theme: Theme;
  customMessage?: string;
}

// Person interface - represents another person in the graph
export interface Person extends BaseEntity {
  type: 'person';
  name: string;
  relationshipToUser: RelationshipType;
  photo?: string;
  email?: string;
  virtualselfProfileId?: string; // link to their virtualself if they have one
  connectionEdgeId?: string; // the connection edge that grants access
  details?: Record<string, any>;
}

// User profile root document
export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  preferredName?: string;
  avatarUrl?: string;
  tagline?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  contexts: ContextView[];
  activeContext: ContextType;
}

// Legacy Paris.json data types - kept for backward compatibility
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
  personalityModel?: {
    selfDescription: string[];
    decisionStyle: string;
    socialEnergy: string;
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
