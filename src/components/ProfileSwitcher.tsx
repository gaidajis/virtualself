import { motion } from 'framer-motion';
import { useVirtualMe2 } from '@/store/useVirtualMe2';
import type { ProfileId } from '@/types/virtualme2';
import { Users, Heart, GraduationCap, Edit3, Download, Upload, Undo, Redo } from 'lucide-react';

const profileIcons: Record<ProfileId, React.ElementType> = {
  networking: Users,
  dating: Heart,
  alumni: GraduationCap,
};

export function ProfileSwitcher() {
  const { 
    data, 
    setActiveProfile, 
    toggleEditMode, 
    isEditMode,
    exportData,
    importData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useVirtualMe2();

  const activeProfileId = data.metadata.activeProfileId;
  const activeProfile = data.profiles.find(p => p.id === activeProfileId);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtualme-profile-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = importData(e.target?.result as string);
          if (result.success) {
            alert('Profile imported successfully!');
          } else {
            alert('Failed to import: ' + result.error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center gap-2 pb-4 pointer-events-none">
      {/* Edit Toolbar */}
      {isEditMode && (
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl pointer-events-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4 text-white/70" />
          </button>
          <div className="w-px h-4 bg-white/20" />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 text-sm"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        </motion.div>
      )}

      {/* Profile Switcher */}
      <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-xl pointer-events-auto">
        {data.profiles.map((profile) => {
          const Icon = profileIcons[profile.id];
          const isActive = activeProfileId === profile.id;
          
          return (
            <motion.button
              key={profile.id}
              onClick={() => setActiveProfile(profile.id)}
              className={`relative px-4 py-2.5 rounded-xl font-medium text-sm tracking-wide transition-all ${
                isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${profile.theme.primary}, ${profile.theme.accent})`,
                  }}
                  layoutId="activeProfile"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {profile.name}
              </span>
            </motion.button>
          );
        })}

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Edit Mode Toggle */}
        <motion.button
          onClick={toggleEditMode}
          className={`relative p-2.5 rounded-xl transition-all ${
            isEditMode 
              ? 'bg-blue-500 text-white' 
              : 'text-white/50 hover:text-white/80 hover:bg-white/10'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
          <Edit3 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Profile Description */}
      <motion.div
        className="text-xs text-white/40"
        key={activeProfileId}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeProfile?.description}
      </motion.div>
    </div>
  );
}
