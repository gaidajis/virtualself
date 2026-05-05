import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  ContextType, 
  ClusterType, 
  ParisData, 
  UserProfile, 
  ConnectionEdge, 
  PermissionGrant,
  Memory,
  TimelineEvent,
  Place,
  Project,
  EducationRecord,
  WorkRole,
  Skill,
  Relationship,
  FamilyMember,
  AncestryNode,
  HealthMetric,
  Goal,
  Habit,
  Narration,
  Photo,
  MediaAttachment,
  Tag,
  Revision,
  EntityType,
  PermissionScope
} from '@/types';

interface ZoomState {
  isZoomed: boolean;
  zoomTarget: ClusterType;
  zoomScale: number;
  zoomX: number;
  zoomY: number;
}

// Viewer context for permission-aware rendering
interface ViewerContext {
  viewerUserId: string | null; // null = public/unauthenticated
  isAuthenticated: boolean;
  connectionStatus?: 'none' | 'pending' | 'accepted' | 'declined';
  grantedPermissions: PermissionScope[];
}

interface VirtualMeState {
  // Current context
  activeContext: ContextType;
  setActiveContext: (context: ContextType) => void;
  
  // Active cluster for detail panel
  activeCluster: ClusterType;
  setActiveCluster: (cluster: ClusterType) => void;
  
  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Legacy data (for backward compatibility)
  rawData: ParisData | null;
  setRawData: (data: ParisData) => void;
  updateRawData: (updater: (data: ParisData) => void) => void;
  
  // Identity Graph Entities - New virtualself data model
  memories: Memory[];
  timelineEvents: TimelineEvent[];
  places: Place[];
  projects: Project[];
  educationRecords: EducationRecord[];
  workRoles: WorkRole[];
  skills: Skill[];
  relationships: Relationship[];
  familyMembers: FamilyMember[];
  ancestryNodes: AncestryNode[];
  healthMetrics: HealthMetric[];
  goals: Goal[];
  habits: Habit[];
  narrations: Narration[];
  photos: Photo[];
  mediaAttachments: MediaAttachment[];
  tags: Tag[];
  
  // Entity CRUD operations
  addMemory: (memory: Memory) => void;
  updateMemory: (id: string, updates: Partial<Memory>) => void;
  deleteMemory: (id: string) => void;
  
  addTimelineEvent: (event: TimelineEvent) => void;
  updateTimelineEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteTimelineEvent: (id: string) => void;
  
  addPlace: (place: Place) => void;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addEducationRecord: (record: EducationRecord) => void;
  updateEducationRecord: (id: string, updates: Partial<EducationRecord>) => void;
  deleteEducationRecord: (id: string) => void;
  
  addWorkRole: (role: WorkRole) => void;
  updateWorkRole: (id: string, updates: Partial<WorkRole>) => void;
  deleteWorkRole: (id: string) => void;
  
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  
  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;
  
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteFamilyMember: (id: string) => void;
  
  addAncestryNode: (node: AncestryNode) => void;
  updateAncestryNode: (id: string, updates: Partial<AncestryNode>) => void;
  deleteAncestryNode: (id: string) => void;
  
  addHealthMetric: (metric: HealthMetric) => void;
  updateHealthMetric: (id: string, updates: Partial<HealthMetric>) => void;
  deleteHealthMetric: (id: string) => void;
  
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  
  addNarration: (narration: Narration) => void;
  updateNarration: (id: string, updates: Partial<Narration>) => void;
  deleteNarration: (id: string) => void;
  
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  
  // Multi-user & Connections
  connections: ConnectionEdge[];
  permissionGrants: PermissionGrant[];
  connectedProfiles: { userId: string; name: string; relationship: string; avatarUrl?: string }[];
  
  addConnection: (connection: ConnectionEdge) => void;
  updateConnectionStatus: (connectionId: string, status: 'pending' | 'accepted' | 'declined' | 'revoked' | 'blocked') => void;
  removeConnection: (connectionId: string) => void;
  
  grantPermission: (grant: PermissionGrant) => void;
  revokePermission: (grantId: string) => void;
  
  // Viewer context
  viewerContext: ViewerContext;
  setViewerContext: (context: ViewerContext) => void;
  
  // UI State
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  
  // Animation state
  isTransitioning: boolean;
  setIsTransitioning: (transitioning: boolean) => void;
  
  // Zoom state
  zoom: ZoomState;
  setZoom: (zoom: Partial<ZoomState>) => void;
  resetZoom: () => void;
  
  // Music state
  isMusicPlaying: boolean;
  setIsMusicPlaying: (playing: boolean) => void;
  currentTrack: string | null;
  setCurrentTrack: (track: string | null) => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;
  
  // Voice recording state
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  recordings: { id: string; blob: Blob; timestamp: number; transcript?: string }[];
  addRecording: (recording: { id: string; blob: Blob; timestamp: number; transcript?: string }) => void;
  deleteRecording: (id: string) => void;
  
  // Notes
  notes: string;
  setNotes: (notes: string) => void;
  
  // Edit mode
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  toggleEditMode: () => void;
  
  // Context labels (editable)
  contextLabels: Record<ContextType, { name: string; description: string }>;
  updateContextLabel: (context: ContextType, updates: Partial<{ name: string; description: string }>) => void;
  
  // Cluster labels (editable)
  clusterLabels: Record<string, string>;
  updateClusterLabel: (cluster: string, label: string) => void;
  
  // Revisions history
  revisions: Revision[];
  addRevision: (revision: Revision) => void;
  
  // Save/Export
  exportData: () => string;
  importData: (json: string) => void;
  
  // Filter utility - get filtered data based on context and permissions
  getFilteredData: <T>(entities: T[], context: ContextType, requiredPermission?: PermissionScope) => T[];
}

const initialZoomState: ZoomState = {
  isZoomed: false,
  zoomTarget: null,
  zoomScale: 1,
  zoomX: 0,
  zoomY: 0,
};

const defaultContextLabels: Record<ContextType, { name: string; description: string }> = {
  PUBLIC: { name: 'PUBLIC', description: 'General profile view' },
  DATING: { name: 'DATING', description: 'Personal & lifestyle' },
  WORK: { name: 'WORK', description: 'Professional focus' },
  PRIVATE: { name: 'PRIVATE', description: 'Full access' },
};

const defaultClusterLabels: Record<string, string> = {
  timeline: 'Timeline',
  music: 'Interests',
  places: 'Places',
  expertise: 'Expertise',
  genealogy: 'Genealogy',
};

export const useVirtualMe = create<VirtualMeState>()(
  immer((set, get) => ({
    activeContext: 'PUBLIC',
    setActiveContext: (context) => set({ activeContext: context, isTransitioning: true }),
    
    activeCluster: null,
    setActiveCluster: (cluster) => set({ activeCluster: cluster }),
    
    rawData: null,
    setRawData: (data) => set({ rawData: data }),
    updateRawData: (updater) => {
      set((state) => {
        if (state.rawData) {
          updater(state.rawData);
        }
      });
    },
    
    isPanelOpen: false,
    setIsPanelOpen: (open) => set({ isPanelOpen: open }),
    
    isTransitioning: false,
    setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
    
    zoom: initialZoomState,
    setZoom: (zoom) => set((state) => ({ zoom: { ...state.zoom, ...zoom } })),
    resetZoom: () => set({ zoom: initialZoomState, activeCluster: null }),
    
    isMusicPlaying: false,
    setIsMusicPlaying: (playing) => set({ isMusicPlaying: playing }),
    currentTrack: null,
    setCurrentTrack: (track) => set({ currentTrack: track }),
    musicVolume: 0.3,
    setMusicVolume: (volume) => set({ musicVolume: volume }),
    
    isRecording: false,
    setIsRecording: (recording) => set({ isRecording: recording }),
    recordings: [],
    addRecording: (recording) => set((state) => ({ 
      recordings: [...state.recordings, recording] 
    })),
    deleteRecording: (id) => set((state) => ({ 
      recordings: state.recordings.filter(r => r.id !== id) 
    })),
    
    notes: '',
    setNotes: (notes) => set({ notes }),
    
    // Edit mode
    isEditMode: false,
    setIsEditMode: (edit) => set({ isEditMode: edit }),
    toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
    
    // Context labels
    contextLabels: { ...defaultContextLabels },
    updateContextLabel: (context, updates) => {
      set((state) => {
        state.contextLabels[context] = { ...state.contextLabels[context], ...updates };
      });
    },
    
    // Cluster labels
    clusterLabels: { ...defaultClusterLabels },
    updateClusterLabel: (cluster, label) => {
      set((state) => {
        state.clusterLabels[cluster] = label;
      });
    },
    
    // Export/Import
    exportData: () => {
      const state = get();
      const exportObj = {
        rawData: state.rawData,
        contextLabels: state.contextLabels,
        clusterLabels: state.clusterLabels,
        notes: state.notes,
        exportedAt: new Date().toISOString(),
      };
      return JSON.stringify(exportObj, null, 2);
    },
    
    importData: (json) => {
      try {
        const data = JSON.parse(json);
        set((state) => {
          if (data.rawData) state.rawData = data.rawData;
          if (data.contextLabels) state.contextLabels = data.contextLabels;
          if (data.clusterLabels) state.clusterLabels = data.clusterLabels;
          if (data.notes) state.notes = data.notes;
        });
      } catch (e) {
        console.error('Failed to import data:', e);
      }
    },
  }))
);
