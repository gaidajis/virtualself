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
  
  // Selected cluster for detail panel
  selectedCluster: ClusterType | null;
  setSelectedCluster: (cluster: ClusterType | null) => void;
  activeCluster: ClusterType | null;
  setActiveCluster: (cluster: ClusterType | null) => void;
  
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
  FAMILY: { name: 'FAMILY', description: 'Family & ancestry focus' },
  STUDENT: { name: 'STUDENT', description: 'Education & alumni view' },
  MEMORY: { name: 'MEMORY', description: 'Memory exploration mode' },
  ANCESTRY: { name: 'ANCESTRY', description: 'Lineage & heritage view' },
  EDIT: { name: 'EDIT', description: 'Editing & management mode' },
  ZOOM_HELP: { name: 'ZOOM_HELP', description: 'Exploration instructions' },
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
    // Current context
    activeContext: 'PUBLIC',
    setActiveContext: (context) => set({ activeContext: context, isTransitioning: true }),
    
    // Selected cluster for detail panel
    selectedCluster: null,
    setSelectedCluster: (cluster) => set({ selectedCluster: cluster }),
    activeCluster: null,
    setActiveCluster: (cluster) => set({ activeCluster: cluster }),
    
    // User profile
    userProfile: null,
    setUserProfile: (profile) => set({ userProfile: profile }),
    updateUserProfile: (updates) => set((state) => {
      if (state.userProfile) {
        state.userProfile = { ...state.userProfile, ...updates };
      }
    }),
    
    // Legacy data (for backward compatibility)
    rawData: null,
    setRawData: (data) => {
      localStorage.setItem('virtualMeData', JSON.stringify(data));
      set({ rawData: data });
    },
    updateRawData: (updater) => {
      set((state) => {
        if (state.rawData) {
          updater(state.rawData);
          localStorage.setItem('virtualMeData', JSON.stringify(state.rawData));
        }
      });
    },
    
    // Identity Graph Entities - New virtualself data model
    memories: [],
    timelineEvents: [],
    places: [],
    projects: [],
    educationRecords: [],
    workRoles: [],
    skills: [],
    relationships: [],
    familyMembers: [],
    ancestryNodes: [],
    healthMetrics: [],
    goals: [],
    habits: [],
    narrations: [],
    photos: [],
    mediaAttachments: [],
    tags: [],
    
    // Entity CRUD operations
    addMemory: (memory) => set((state) => { state.memories.push(memory); }),
    updateMemory: (id, updates) => set((state) => {
      const idx = state.memories.findIndex(m => m.id === id);
      if (idx !== -1) state.memories[idx] = { ...state.memories[idx], ...updates };
    }),
    deleteMemory: (id) => set((state) => {
      state.memories = state.memories.filter(m => m.id !== id);
    }),
    
    addTimelineEvent: (event) => set((state) => { state.timelineEvents.push(event); }),
    updateTimelineEvent: (id, updates) => set((state) => {
      const idx = state.timelineEvents.findIndex(e => e.id === id);
      if (idx !== -1) state.timelineEvents[idx] = { ...state.timelineEvents[idx], ...updates };
    }),
    deleteTimelineEvent: (id) => set((state) => {
      state.timelineEvents = state.timelineEvents.filter(e => e.id !== id);
    }),
    
    addPlace: (place) => set((state) => { state.places.push(place); }),
    updatePlace: (id, updates) => set((state) => {
      const idx = state.places.findIndex(p => p.id === id);
      if (idx !== -1) state.places[idx] = { ...state.places[idx], ...updates };
    }),
    deletePlace: (id) => set((state) => {
      state.places = state.places.filter(p => p.id !== id);
    }),
    
    addProject: (project) => set((state) => { state.projects.push(project); }),
    updateProject: (id, updates) => set((state) => {
      const idx = state.projects.findIndex(p => p.id === id);
      if (idx !== -1) state.projects[idx] = { ...state.projects[idx], ...updates };
    }),
    deleteProject: (id) => set((state) => {
      state.projects = state.projects.filter(p => p.id !== id);
    }),
    
    addEducationRecord: (record) => set((state) => { state.educationRecords.push(record); }),
    updateEducationRecord: (id, updates) => set((state) => {
      const idx = state.educationRecords.findIndex(e => e.id === id);
      if (idx !== -1) state.educationRecords[idx] = { ...state.educationRecords[idx], ...updates };
    }),
    deleteEducationRecord: (id) => set((state) => {
      state.educationRecords = state.educationRecords.filter(e => e.id !== id);
    }),
    
    addWorkRole: (role) => set((state) => { state.workRoles.push(role); }),
    updateWorkRole: (id, updates) => set((state) => {
      const idx = state.workRoles.findIndex(r => r.id === id);
      if (idx !== -1) state.workRoles[idx] = { ...state.workRoles[idx], ...updates };
    }),
    deleteWorkRole: (id) => set((state) => {
      state.workRoles = state.workRoles.filter(r => r.id !== id);
    }),
    
    addSkill: (skill) => set((state) => { state.skills.push(skill); }),
    updateSkill: (id, updates) => set((state) => {
      const idx = state.skills.findIndex(s => s.id === id);
      if (idx !== -1) state.skills[idx] = { ...state.skills[idx], ...updates };
    }),
    deleteSkill: (id) => set((state) => {
      state.skills = state.skills.filter(s => s.id !== id);
    }),
    
    addRelationship: (relationship) => set((state) => { state.relationships.push(relationship); }),
    updateRelationship: (id, updates) => set((state) => {
      const idx = state.relationships.findIndex(r => r.id === id);
      if (idx !== -1) state.relationships[idx] = { ...state.relationships[idx], ...updates };
    }),
    deleteRelationship: (id) => set((state) => {
      state.relationships = state.relationships.filter(r => r.id !== id);
    }),
    
    addFamilyMember: (member) => set((state) => { state.familyMembers.push(member); }),
    updateFamilyMember: (id, updates) => set((state) => {
      const idx = state.familyMembers.findIndex(m => m.id === id);
      if (idx !== -1) state.familyMembers[idx] = { ...state.familyMembers[idx], ...updates };
    }),
    deleteFamilyMember: (id) => set((state) => {
      state.familyMembers = state.familyMembers.filter(m => m.id !== id);
    }),
    
    addAncestryNode: (node) => set((state) => { state.ancestryNodes.push(node); }),
    updateAncestryNode: (id, updates) => set((state) => {
      const idx = state.ancestryNodes.findIndex(n => n.id === id);
      if (idx !== -1) state.ancestryNodes[idx] = { ...state.ancestryNodes[idx], ...updates };
    }),
    deleteAncestryNode: (id) => set((state) => {
      state.ancestryNodes = state.ancestryNodes.filter(n => n.id !== id);
    }),
    
    addHealthMetric: (metric) => set((state) => { state.healthMetrics.push(metric); }),
    updateHealthMetric: (id, updates) => set((state) => {
      const idx = state.healthMetrics.findIndex(m => m.id === id);
      if (idx !== -1) state.healthMetrics[idx] = { ...state.healthMetrics[idx], ...updates };
    }),
    deleteHealthMetric: (id) => set((state) => {
      state.healthMetrics = state.healthMetrics.filter(m => m.id !== id);
    }),
    
    addGoal: (goal) => set((state) => { state.goals.push(goal); }),
    updateGoal: (id, updates) => set((state) => {
      const idx = state.goals.findIndex(g => g.id === id);
      if (idx !== -1) state.goals[idx] = { ...state.goals[idx], ...updates };
    }),
    deleteGoal: (id) => set((state) => {
      state.goals = state.goals.filter(g => g.id !== id);
    }),
    
    addHabit: (habit) => set((state) => { state.habits.push(habit); }),
    updateHabit: (id, updates) => set((state) => {
      const idx = state.habits.findIndex(h => h.id === id);
      if (idx !== -1) state.habits[idx] = { ...state.habits[idx], ...updates };
    }),
    deleteHabit: (id) => set((state) => {
      state.habits = state.habits.filter(h => h.id !== id);
    }),
    
    addNarration: (narration) => set((state) => { state.narrations.push(narration); }),
    updateNarration: (id, updates) => set((state) => {
      const idx = state.narrations.findIndex(n => n.id === id);
      if (idx !== -1) state.narrations[idx] = { ...state.narrations[idx], ...updates };
    }),
    deleteNarration: (id) => set((state) => {
      state.narrations = state.narrations.filter(n => n.id !== id);
    }),
    
    addPhoto: (photo) => set((state) => { state.photos.push(photo); }),
    updatePhoto: (id, updates) => set((state) => {
      const idx = state.photos.findIndex(p => p.id === id);
      if (idx !== -1) state.photos[idx] = { ...state.photos[idx], ...updates };
    }),
    deletePhoto: (id) => set((state) => {
      state.photos = state.photos.filter(p => p.id !== id);
    }),
    
    addTag: (tag) => set((state) => { state.tags.push(tag); }),
    updateTag: (id, updates) => set((state) => {
      const idx = state.tags.findIndex(t => t.id === id);
      if (idx !== -1) state.tags[idx] = { ...state.tags[idx], ...updates };
    }),
    deleteTag: (id) => set((state) => {
      state.tags = state.tags.filter(t => t.id !== id);
    }),
    
    // Multi-user & Connections
    connections: [],
    permissionGrants: [],
    connectedProfiles: [],
    
    addConnection: (connection) => set((state) => { state.connections.push(connection); }),
    updateConnectionStatus: (connectionId, status) => set((state) => {
      const idx = state.connections.findIndex(c => c.id === connectionId);
      if (idx !== -1) state.connections[idx].status = status;
    }),
    removeConnection: (connectionId) => set((state) => {
      state.connections = state.connections.filter(c => c.id !== connectionId);
    }),
    
    grantPermission: (grant) => set((state) => { state.permissionGrants.push(grant); }),
    revokePermission: (grantId) => set((state) => {
      state.permissionGrants = state.permissionGrants.filter(g => g.id !== grantId);
    }),
    
    // Viewer context
    viewerContext: {
      viewerUserId: null,
      isAuthenticated: false,
      grantedPermissions: ['public'],
    },
    setViewerContext: (context) => set({ viewerContext: context }),
    
    // UI State
    isPanelOpen: false,
    setIsPanelOpen: (open) => set({ isPanelOpen: open }),
    
    // Animation state
    isTransitioning: false,
    setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
    
    // Zoom state
    zoom: initialZoomState,
    setZoom: (zoom) => set((state) => ({ zoom: { ...state.zoom, ...zoom } })),
    resetZoom: () => set({ zoom: initialZoomState, activeCluster: null, selectedCluster: null }),
    
    // Music state
    isMusicPlaying: false,
    setIsMusicPlaying: (playing) => set({ isMusicPlaying: playing }),
    currentTrack: null,
    setCurrentTrack: (track) => set({ currentTrack: track }),
    musicVolume: 0.3,
    setMusicVolume: (volume) => set({ musicVolume: volume }),
    
    // Voice recording state
    isRecording: false,
    setIsRecording: (recording) => set({ isRecording: recording }),
    recordings: [],
    addRecording: (recording) => set((state) => ({ 
      recordings: [...state.recordings, recording] 
    })),
    deleteRecording: (id) => set((state) => ({ 
      recordings: state.recordings.filter(r => r.id !== id) 
    })),
    
    // Notes
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
    
    // Revisions history
    revisions: [],
    addRevision: (revision) => set((state) => { state.revisions.push(revision); }),
    
    // Save/Export
    exportData: () => {
      const state = get();
      if (state.rawData) {
        return JSON.stringify(state.rawData, null, 2);
      }
      const exportObj = {
        userProfile: state.userProfile,
        rawData: state.rawData,
        memories: state.memories,
        timelineEvents: state.timelineEvents,
        places: state.places,
        projects: state.projects,
        educationRecords: state.educationRecords,
        workRoles: state.workRoles,
        skills: state.skills,
        relationships: state.relationships,
        familyMembers: state.familyMembers,
        ancestryNodes: state.ancestryNodes,
        healthMetrics: state.healthMetrics,
        goals: state.goals,
        habits: state.habits,
        narrations: state.narrations,
        photos: state.photos,
        tags: state.tags,
        connections: state.connections,
        permissionGrants: state.permissionGrants,
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
          if (data.userProfile) state.userProfile = data.userProfile;
          if (data.rawData) state.rawData = data.rawData;
          if (data.memories) state.memories = data.memories;
          if (data.timelineEvents) state.timelineEvents = data.timelineEvents;
          if (data.places) state.places = data.places;
          if (data.projects) state.projects = data.projects;
          if (data.educationRecords) state.educationRecords = data.educationRecords;
          if (data.workRoles) state.workRoles = data.workRoles;
          if (data.skills) state.skills = data.skills;
          if (data.relationships) state.relationships = data.relationships;
          if (data.familyMembers) state.familyMembers = data.familyMembers;
          if (data.ancestryNodes) state.ancestryNodes = data.ancestryNodes;
          if (data.healthMetrics) state.healthMetrics = data.healthMetrics;
          if (data.goals) state.goals = data.goals;
          if (data.habits) state.habits = data.habits;
          if (data.narrations) state.narrations = data.narrations;
          if (data.photos) state.photos = data.photos;
          if (data.tags) state.tags = data.tags;
          if (data.connections) state.connections = data.connections;
          if (data.permissionGrants) state.permissionGrants = data.permissionGrants;
          if (data.contextLabels) state.contextLabels = data.contextLabels;
          if (data.clusterLabels) state.clusterLabels = data.clusterLabels;
          if (data.notes) state.notes = data.notes;
        });
      } catch (e) {
        console.error('Failed to import data:', e);
      }
    },
    
    // Filter utility - get filtered data based on context and permissions
    getFilteredData: (entities, context, requiredPermission) => {
      const state = get();
      const viewerPerms = state.viewerContext.grantedPermissions;

      // Check early to avoid setting up if empty
      if (!entities || entities.length === 0) return [];

      // Calculate max perm index outside the loop
      const permHierarchy: PermissionScope[] = [
        'strict_private',
        'private',
        'partner_only',
        'family_only',
        'approved_connection',
        'alumni_network_only',
        'work_network_only',
        'authenticated',
        'public'
      ];

      const viewerMaxPermIdx = Math.max(...viewerPerms.map(p => permHierarchy.indexOf(p)));
      
      return entities.filter(entity => {
        const entityPerm = (entity as any).visibility || 'public';
        
        // Check if viewer has required permission
        if (requiredPermission && !viewerPerms.includes(requiredPermission)) {
          return false;
        }
        
        // Check entity visibility based on context
        if (context === 'PRIVATE' || context === 'EDIT') {
          return true; // Owner sees everything
        }
        
        if (context === 'PUBLIC') {
          return entityPerm === 'public';
        }
        
        // For other contexts, check permission hierarchy
        const entityPermIdx = permHierarchy.indexOf(entityPerm);
        
        return entityPermIdx >= viewerMaxPermIdx || entityPerm === 'public';
      });
    },
  }))
);
