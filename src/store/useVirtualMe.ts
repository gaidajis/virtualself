import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ContextType, ClusterType, ParisData } from '@/types';

interface ZoomState {
  isZoomed: boolean;
  zoomTarget: ClusterType;
  zoomScale: number;
  zoomX: number;
  zoomY: number;
}

interface VirtualMeState {
  // Current context
  activeContext: ContextType;
  setActiveContext: (context: ContextType) => void;
  
  // Active cluster for detail panel
  activeCluster: ClusterType;
  setActiveCluster: (cluster: ClusterType) => void;
  
  // Data
  rawData: ParisData | null;
  setRawData: (data: ParisData) => void;
  updateRawData: (updater: (data: ParisData) => void) => void;
  
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
  
  // Save/Export
  exportData: () => string;
  importData: (json: string) => void;
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
