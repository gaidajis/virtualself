import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { VirtualMeState, VirtualMeData, SectionType, Position, ProfileId, HistoryState } from '@/types/virtualme2';
import { defaultVirtualMeData } from '@/data/defaultData';

const createHistory = (data: VirtualMeData): HistoryState => ({
  past: [],
  present: data,
  future: [],
});

const initialHistory = createHistory(defaultVirtualMeData);

export const useVirtualMe2 = create<VirtualMeState>()(
  immer((set, get) => ({
    // Data
    data: defaultVirtualMeData,
    history: initialHistory,

    // Navigation
    zoomLevel: 'overview',
    activeSectionId: null,
    activeItemId: null,
    cameraPosition: { x: 0, y: 0, scale: 1 },
    isPanning: false,

    // Edit Mode
    isEditMode: false,
    selectedSectionId: null,

    // Undo/Redo state
    canUndo: false,
    canRedo: false,

    // Profile Actions
    setActiveProfile: (id: ProfileId) => {
      set((state) => {
        state.data.metadata.activeProfileId = id;
        state.data.metadata.lastModified = new Date().toISOString();
      });
    },

    // Navigation Actions
    zoomToSection: (sectionId: string) => {
      const section = get().data.sections.find(s => s.id === sectionId);
      if (!section) return;

      set((state) => {
        state.zoomLevel = 'section';
        state.activeSectionId = sectionId;
        state.activeItemId = null;
        state.cameraPosition = {
          x: -section.position.x * state.data.globalSettings.zoomLevels.section,
          y: -section.position.y * state.data.globalSettings.zoomLevels.section,
          scale: state.data.globalSettings.zoomLevels.section,
        };
      });
    },

    zoomToItem: (sectionId: string, itemId: string) => {
      const section = get().data.sections.find(s => s.id === sectionId);
      if (!section) return;

      set((state) => {
        state.zoomLevel = 'detail';
        state.activeSectionId = sectionId;
        state.activeItemId = itemId;
        state.cameraPosition = {
          x: -section.position.x * state.data.globalSettings.zoomLevels.detail,
          y: -section.position.y * state.data.globalSettings.zoomLevels.detail,
          scale: state.data.globalSettings.zoomLevels.detail,
        };
      });
    },

    zoomToOverview: () => {
      set((state) => {
        state.zoomLevel = 'overview';
        state.activeSectionId = null;
        state.activeItemId = null;
        state.cameraPosition = { x: 0, y: 0, scale: 1 };
      });
    },

    setCameraPosition: (pos: { x: number; y: number; scale: number }) => {
      set((state) => {
        state.cameraPosition = pos;
      });
    },

    // Edit Mode Actions
    toggleEditMode: () => {
      set((state) => {
        state.isEditMode = !state.isEditMode;
      });
    },

    setSelectedSectionId: (id: string | null) => {
      set((state) => {
        state.selectedSectionId = id;
      });
    },

    // Section Actions
    updateSection: (sectionId: string, updates: any) => {
      set((state) => {
        // Save to history
        state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
        state.history.present = JSON.parse(JSON.stringify(state.data));
        state.history.future = [];
        state.canUndo = true;
        state.canRedo = false;

        const section = state.data.sections.find(s => s.id === sectionId);
        if (section) {
          Object.assign(section, updates);
          state.data.metadata.lastModified = new Date().toISOString();
        }
      });
    },

    addSection: (type: SectionType, position: Position) => {
      set((state) => {
        // Save to history
        state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
        state.history.present = JSON.parse(JSON.stringify(state.data));
        state.history.future = [];
        state.canUndo = true;
        state.canRedo = false;

        const id = `section-${Date.now()}`;
        const newSection = {
          id,
          type,
          title: getDefaultSectionTitle(type),
          position,
          icon: getDefaultSectionIcon(type),
          color: getDefaultSectionColor(type),
          content: getDefaultSectionContent(type),
        };
        state.data.sections.push(newSection);
        state.data.metadata.lastModified = new Date().toISOString();
      });
    },

    removeSection: (sectionId: string) => {
      set((state) => {
        // Save to history
        state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
        state.history.present = JSON.parse(JSON.stringify(state.data));
        state.history.future = [];
        state.canUndo = true;
        state.canRedo = false;

        state.data.sections = state.data.sections.filter(s => s.id !== sectionId);
        state.data.connections = state.data.connections.filter(
          c => c.from !== sectionId && c.to !== sectionId
        );
        state.data.metadata.lastModified = new Date().toISOString();
      });
    },

    updateSectionPosition: (sectionId: string, position: Position) => {
      set((state) => {
        const section = state.data.sections.find(s => s.id === sectionId);
        if (section) {
          section.position = position;
          state.data.metadata.lastModified = new Date().toISOString();
        }
      });
    },

    // Content Actions
    updateItem: (sectionId: string, itemId: string, updates: any) => {
      set((state) => {
        // Save to history
        state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
        state.history.present = JSON.parse(JSON.stringify(state.data));
        state.history.future = [];
        state.canUndo = true;
        state.canRedo = false;

        const section = state.data.sections.find(s => s.id === sectionId);
        if (!section) return;

        if (section.content.institutions) {
          const item = section.content.institutions.find((i: any) => i.id === itemId);
          if (item) Object.assign(item, updates);
        }
        if (section.content.languages) {
          const item = section.content.languages.find((i: any) => i.id === itemId);
          if (item) Object.assign(item, updates);
        }
        if (section.content.categories) {
          const item = section.content.categories.find((i: any) => i.id === itemId);
          if (item) Object.assign(item, updates);
        }
        if (section.content.events) {
          const item = section.content.events.find((i: any) => i.id === itemId);
          if (item) Object.assign(item, updates);
        }
        if (section.content.skills) {
          const item = section.content.skills.find((i: any) => i.id === itemId);
          if (item) Object.assign(item, updates);
        }

        state.data.metadata.lastModified = new Date().toISOString();
      });
    },

    addItem: (sectionId: string, item: any) => {
      set((state) => {
        // Save to history
        state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
        state.history.present = JSON.parse(JSON.stringify(state.data));
        state.history.future = [];
        state.canUndo = true;
        state.canRedo = false;

        const section = state.data.sections.find(s => s.id === sectionId);
        if (!section) return;

        const newItem = { ...item, id: `item-${Date.now()}` };

        if (section.content.institutions) {
          section.content.institutions.push(newItem);
        } else if (section.content.languages) {
          section.content.languages.push(newItem);
        } else if (section.content.categories) {
          section.content.categories.push(newItem);
        } else if (section.content.events) {
          section.content.events.push(newItem);
        } else if (section.content.skills) {
          section.content.skills.push(newItem);
        } else if (section.content.achievements) {
          section.content.achievements.push(newItem);
        }

        state.data.metadata.lastModified = new Date().toISOString();
      });
    },

    removeItem: (sectionId: string, itemId: string) => {
      set((state) => {
        // Save to history
        state.history.past.push(JSON.parse(JSON.stringify(state.history.present)));
        state.history.present = JSON.parse(JSON.stringify(state.data));
        state.history.future = [];
        state.canUndo = true;
        state.canRedo = false;

        const section = state.data.sections.find(s => s.id === sectionId);
        if (!section) return;

        if (section.content.institutions) {
          section.content.institutions = section.content.institutions.filter((i: any) => i.id !== itemId);
        } else if (section.content.languages) {
          section.content.languages = section.content.languages.filter((i: any) => i.id !== itemId);
        } else if (section.content.categories) {
          section.content.categories = section.content.categories.filter((i: any) => i.id !== itemId);
        } else if (section.content.events) {
          section.content.events = section.content.events.filter((i: any) => i.id !== itemId);
        } else if (section.content.skills) {
          section.content.skills = section.content.skills.filter((i: any) => i.id !== itemId);
        } else if (section.content.achievements) {
          section.content.achievements = section.content.achievements.filter((a: any) => a !== itemId);
        }

        state.data.metadata.lastModified = new Date().toISOString();
      });
    },

    // Photo Actions
    updatePhoto: (profileId: ProfileId, photoId: string, updates: any) => {
      set((state) => {
        const profile = state.data.profiles.find(p => p.id === profileId);
        if (profile) {
          const photo = profile.photos.find(p => p.id === photoId);
          if (photo) Object.assign(photo, updates);
          state.data.metadata.lastModified = new Date().toISOString();
        }
      });
    },

    addPhoto: (profileId: ProfileId, photo: any) => {
      set((state) => {
        const profile = state.data.profiles.find(p => p.id === profileId);
        if (profile) {
          const newPhoto = {
            ...photo,
            id: `photo-${Date.now()}`,
            order: profile.photos.length,
          };
          profile.photos.push(newPhoto);
          state.data.metadata.lastModified = new Date().toISOString();
        }
      });
    },

    removePhoto: (profileId: ProfileId, photoId: string) => {
      set((state) => {
        const profile = state.data.profiles.find(p => p.id === profileId);
        if (profile) {
          profile.photos = profile.photos.filter(p => p.id !== photoId);
          profile.photos.forEach((p, i) => { p.order = i; });
          state.data.metadata.lastModified = new Date().toISOString();
        }
      });
    },

    reorderPhotos: (profileId: ProfileId, photoIds: string[]) => {
      set((state) => {
        const profile = state.data.profiles.find(p => p.id === profileId);
        if (profile) {
          const reordered: any[] = [];
          photoIds.forEach(id => {
            const photo = profile.photos.find(p => p.id === id);
            if (photo) reordered.push(photo);
          });
          profile.photos = reordered.map((p, i) => ({ ...p, order: i }));
          state.data.metadata.lastModified = new Date().toISOString();
        }
      });
    },

    // JSON Actions
    importData: (json: string): { success: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(json);
        if (!parsed.metadata || !parsed.sections || !parsed.profiles) {
          return { success: false, error: 'Invalid JSON structure' };
        }
        
        set((state) => {
          state.data = parsed;
          state.history = createHistory(parsed);
          state.canUndo = false;
          state.canRedo = false;
        });
        return { success: true };
      } catch (e) {
        return { success: false, error: 'Failed to parse JSON' };
      }
    },

    exportData: (): string => {
      return JSON.stringify(get().data, null, 2);
    },

    // Undo/Redo
    undo: () => {
      set((state) => {
        if (state.history.past.length > 0) {
          const previous = state.history.past.pop()!;
          state.history.future.unshift(state.history.present);
          state.history.present = previous;
          state.data = JSON.parse(JSON.stringify(previous));
          state.canUndo = state.history.past.length > 0;
          state.canRedo = true;
        }
      });
    },

    redo: () => {
      set((state) => {
        if (state.history.future.length > 0) {
          const next = state.history.future.shift()!;
          state.history.past.push(state.history.present);
          state.history.present = next;
          state.data = JSON.parse(JSON.stringify(next));
          state.canUndo = true;
          state.canRedo = state.history.future.length > 0;
        }
      });
    },
  }))
);

// Helper functions
function getDefaultSectionTitle(type: SectionType): string {
  const titles: Record<SectionType, string> = {
    knowledge: 'Knowledge & Experience',
    education: 'Education',
    languages: 'Languages',
    interests: 'Interests',
    timeline: 'Timeline',
    skills: 'Skills',
  };
  return titles[type];
}

function getDefaultSectionIcon(type: SectionType): string {
  const icons: Record<SectionType, string> = {
    knowledge: 'Briefcase',
    education: 'GraduationCap',
    languages: 'Languages',
    interests: 'Heart',
    timeline: 'Calendar',
    skills: 'Zap',
  };
  return icons[type];
}

function getDefaultSectionColor(type: SectionType): string {
  const colors: Record<SectionType, string> = {
    knowledge: '#3b82f6',
    education: '#8b5cf6',
    languages: '#10b981',
    interests: '#f59e0b',
    timeline: '#ec4899',
    skills: '#06b6d4',
  };
  return colors[type];
}

function getDefaultSectionContent(type: SectionType): any {
  const contents: Record<SectionType, any> = {
    knowledge: {
      currentRole: '',
      organization: '',
      location: '',
      summary: '',
      achievements: [],
      customFields: {},
    },
    education: {
      institutions: [],
      customFields: {},
    },
    languages: {
      languages: [],
      customFields: {},
    },
    interests: {
      categories: [],
      customFields: {},
    },
    timeline: {
      events: [],
      customFields: {},
    },
    skills: {
      skills: [],
      customFields: {},
    },
  };
  return contents[type];
}
