// VirtualMe 2.0 - Complete Type Definitions

export type SectionType = 'knowledge' | 'education' | 'languages' | 'interests' | 'timeline' | 'skills';
export type ZoomLevel = 'overview' | 'section' | 'detail';
export type ProfileId = 'networking' | 'dating' | 'alumni';

export interface Position {
  x: number;
  y: number;
}

export interface Theme {
  primary: string;
  accent: string;
  gradient: string;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface Institution {
  id: string;
  name: string;
  degree?: string;
  status?: 'complete' | 'incomplete' | 'ongoing';
  years?: string;
  location?: string;
  logo?: string | null;
  customFields: Record<string, any>;
}

export interface Language {
  id: string;
  name: string;
  level: 'native' | 'fluent' | 'conversational' | 'learning';
  flag: string;
}

export interface InterestCategory {
  id: string;
  name: string;
  items: string[];
}

export interface LifeEvent {
  id: string;
  year: number;
  title: string;
  location?: string;
  icon: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'other';
  level?: number; // 1-5
}

export interface SectionContent {
  // Knowledge & CV
  currentRole?: string;
  organization?: string;
  location?: string;
  summary?: string;
  achievements?: string[];
  
  // Education
  institutions?: Institution[];
  
  // Languages
  languages?: Language[];
  
  // Interests
  categories?: InterestCategory[];
  
  // Timeline
  events?: LifeEvent[];
  
  // Skills
  skills?: Skill[];
  
  // Custom fields
  customFields: Record<string, any>;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  position: Position;
  icon: string;
  color: string;
  content: SectionContent;
}

export interface Profile {
  id: ProfileId;
  name: string;
  description: string;
  theme: Theme;
  photos: Photo[];
  visibleSections: string[];
  sectionFilters: Record<string, Record<string, boolean>>;
  customMessage?: string;
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  profileIds: ProfileId[];
  photo?: string;
  details: Record<string, any>;
}

export interface Connection {
  from: string;
  to: string;
  strength: number;
}

export interface GlobalSettings {
  backgroundMusic: boolean;
  theme: {
    primaryColor: string;
    accentColor: string;
    background: string;
  };
  zoomLevels: {
    overview: number;
    section: number;
    detail: number;
  };
}

export interface Metadata {
  version: string;
  lastModified: string;
  activeProfileId: ProfileId;
}

export interface VirtualMeData {
  metadata: Metadata;
  globalSettings: GlobalSettings;
  sections: Section[];
  profiles: Profile[];
  people: Person[];
  connections: Connection[];
}

// History state for undo/redo
export interface HistoryState {
  past: VirtualMeData[];
  present: VirtualMeData;
  future: VirtualMeData[];
}

// Store State
export interface VirtualMeState {
  // Data
  data: VirtualMeData;
  history: HistoryState;
  
  // Navigation
  zoomLevel: ZoomLevel;
  activeSectionId: string | null;
  activeItemId: string | null;
  cameraPosition: { x: number; y: number; scale: number };
  isPanning: boolean;
  
  // Edit Mode
  isEditMode: boolean;
  selectedSectionId: string | null;
  
  // Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setActiveProfile: (id: ProfileId) => void;
  zoomToSection: (sectionId: string) => void;
  zoomToItem: (sectionId: string, itemId: string) => void;
  zoomToOverview: () => void;
  setCameraPosition: (pos: { x: number; y: number; scale: number }) => void;
  
  // Edit Actions
  toggleEditMode: () => void;
  setSelectedSectionId: (id: string | null) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  addSection: (type: SectionType, position: Position) => void;
  removeSection: (sectionId: string) => void;
  updateSectionPosition: (sectionId: string, position: Position) => void;
  
  // Content Actions
  updateItem: (sectionId: string, itemId: string, updates: any) => void;
  addItem: (sectionId: string, item: any) => void;
  removeItem: (sectionId: string, itemId: string) => void;
  
  // Photo Actions
  updatePhoto: (profileId: ProfileId, photoId: string, updates: Partial<Photo>) => void;
  addPhoto: (profileId: ProfileId, photo: Omit<Photo, 'id' | 'order'>) => void;
  removePhoto: (profileId: ProfileId, photoId: string) => void;
  reorderPhotos: (profileId: ProfileId, photoIds: string[]) => void;
  
  // JSON Actions
  importData: (json: string) => { success: boolean; error?: string };
  exportData: () => string;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
}
