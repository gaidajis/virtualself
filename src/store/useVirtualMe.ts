import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { ProfileData, ContextType, ClusterType } from '@/types';

interface VirtualMeState {
  // Data
  profileData: ProfileData | null;
  
  // State
  activeContext: ContextType;
  selectedCluster: ClusterType;
  isEditMode: boolean;
  isLoading: boolean;
  
  // Actions
  setProfileData: (data: ProfileData) => void;
  setActiveContext: (context: ContextType) => void;
  setSelectedCluster: (cluster: ClusterType) => void;
  toggleEditMode: () => void;
  setIsLoading: (loading: boolean) => void;
  updateProfileData: (updater: (data: ProfileData) => void) => void;
  exportData: () => string;
  importData: (json: string) => boolean;
}

export const useVirtualMe = create<VirtualMeState>()(
  immer((set, get) => ({
    // Initial state
    profileData: null,
    activeContext: 'PUBLIC',
    selectedCluster: null,
    isEditMode: false,
    isLoading: true,
    
    // Actions
    setProfileData: (data) => {
      set({ profileData: data, isLoading: false });
    },
    
    setActiveContext: (context) => {
      set({ activeContext: context });
    },
    
    setSelectedCluster: (cluster) => {
      set({ selectedCluster: cluster });
    },
    
    toggleEditMode: () => {
      set((state) => {
        state.isEditMode = !state.isEditMode;
      });
    },
    
    setIsLoading: (loading) => {
      set({ isLoading: loading });
    },
    
    updateProfileData: (updater) => {
      set((state) => {
        if (state.profileData) {
          updater(state.profileData);
        }
      });
    },
    
    exportData: () => {
      const { profileData } = get();
      if (!profileData) return '';
      return JSON.stringify(profileData, null, 2);
    },
    
    importData: (json: string) => {
      try {
        const data: ProfileData = JSON.parse(json);
        set({ profileData: data });
        return true;
      } catch (error) {
        console.error('Failed to import data:', error);
        return false;
      }
    },
  }))
);
