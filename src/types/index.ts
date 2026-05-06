export interface ProfileData {
  userId: string;
  profileVersion: string;
  generatedAt: string;
  profileType: string;
  profileStatus: string;
  owner: Owner;
  relationshipProfile: RelationshipProfile;
  professionalIdentity: ProfessionalIdentity;
  educationAndIntellectualFormation: EducationAndIntellectualFormation;
  languagesAndCulture: LanguagesAndCulture;
  lifeTimeline: LifePhase[];
  skillsGraph: SkillsGraph;
  projectsAndRepositories: ProjectsAndRepositories;
  healthPerformanceAndBody: HealthPerformanceAndBody;
  interestsMap: InterestsMap;
  mediaAndMusic: MediaAndMusic;
  photos: Photos;
  locations: Locations;
  valuesAndMotivations: ValuesAndMotivations;
}

export interface Owner {
  fullName: string;
  preferredName: string;
  displayNameOptions: string[];
  dateOfBirth: string;
  placeOfBirth: PlaceOfBirth;
  ancestry: Ancestry;
  citizenship: Citizenship;
  currentResidence: CurrentResidence;
  bodyMetrics: BodyMetrics;
  identityNarrative: IdentityNarrative;
  avatarUrl: string;
}

export interface PlaceOfBirth {
  city: string;
  country: string;
  confidence: string;
}

export interface Ancestry {
  motherNationality: string;
  fatherNationality: string;
  heritageSummary: string;
}

export interface Citizenship {
  passports: string[];
}

export interface CurrentResidence {
  locationLabel: string;
  country: string;
  locality: string;
  sinceApprox: string;
}

export interface BodyMetrics {
  weightKg: number;
}

export interface IdentityNarrative {
  short: string;
  extended: string;
}

export interface RelationshipProfile {
  currentPartner: CurrentPartner;
  weddingSignals: WeddingSignals;
}

export interface CurrentPartner {
  name: string;
  nationality: string;
  relationshipState: string;
}

export interface WeddingSignals {
  weddingPlannerActive: boolean;
  plannerStatus: string;
  sleepArrangementIntent: string;
  reasoning: string[];
}

export interface ProfessionalIdentity {
  currentPrimaryRole: string;
  currentOrganization: string;
  roleSummary: string;
  platformOwnership: string[];
  scope: Scope;
  workPattern: WorkPattern;
}

export interface Scope {
  applicationsManaged: number;
  responsibilities: string[];
}

export interface WorkPattern {
  currentMode: string;
  hoursPerDay: number;
  vacationWeeksPerYear: number;
}

export interface EducationAndIntellectualFormation {
  formalEducation: FormalEducation[];
}

export interface FormalEducation {
  institution: string;
  field: string;
  durationYears: number;
  status: string;
}

export interface LanguagesAndCulture {
  languageSignals: LanguageSignals;
  culturalIdentity: CulturalIdentity;
}

export interface LanguageSignals {
  knownOrUsed: string[];
  learningFocus: string[];
}

export interface CulturalIdentity {
  rootCultures: string[];
}

export interface LifePhase {
  id: string;
  period: string;
  ageRange?: string;
  location: string;
  summary: string;
}

export interface SkillsGraph {
  executiveAndDelivery: string[];
  enterprisePlatforms: string[];
  architectureAndOperations: string[];
  builderSkills: string[];
  metaSkills: string[];
}

export interface ProjectsAndRepositories {
  github: Github;
  platformConcepts: PlatformConcept[];
}

export interface Github {
  username: string;
  repositories: Repository[];
}

export interface Repository {
  name: string;
  url: string;
  notes: string;
}

export interface PlatformConcept {
  id: string;
  title: string;
  type: string;
  summary: string;
}

export interface HealthPerformanceAndBody {
  healthOrientation: string;
  activeConcerns: string[];
  goals: string[];
}

export interface InterestsMap {
  coreInterests: string[];
  spiritualAndConsciousnessSignals: SpiritualAndConsciousnessSignals;
  travelSignals: TravelSignals;
  entertainmentSignals: EntertainmentSignals;
}

export interface SpiritualAndConsciousnessSignals {
  documentLibrary: string[];
}

export interface TravelSignals {
  countriesVisitedApprox: number;
  notablePlaceInterests: string[];
}

export interface EntertainmentSignals {
  seriesAndMedia: string[];
  gamingAndVR: string[];
}

export interface MediaAndMusic {
  favoriteArtists: string[];
  favoriteAlbums: Album[];
  playlists: Playlist[];
}

export interface Album {
  title: string;
  artist: string;
  spotifyUri: string;
}

export interface Playlist {
  name: string;
  spotifyUri: string;
}

export interface Photos {
  galleries: Gallery[];
}

export interface Gallery {
  id: string;
  name: string;
  images: Image[];
}

export interface Image {
  url: string;
  caption: string;
  location: string;
  date: string;
}

export interface Locations {
  residences: Residence[];
}

export interface Residence {
  city: string;
  country: string;
  lat: number;
  lng: number;
  period: string;
  type: string;
}

export interface ValuesAndMotivations {
  coreValues: string[];
  motivationModel: MotivationModel;
}

export interface MotivationModel {
  positiveContributors: string[];
  overallGoal: string;
}

export type ContextType = 'PUBLIC' | 'DATING' | 'WORK' | 'PRIVATE' | 'FAMILY' | 'STUDENT' | 'MEMORY' | 'ANCESTRY' | 'EDIT';

export type ClusterType = 'TIMELINE' | 'INTERESTS' | 'PLACES' | 'EXPERTISE' | 'GENEALOGY' | null;
