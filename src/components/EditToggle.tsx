import { motion } from 'framer-motion';
import { Pencil, Save, Download, Upload } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function EditToggle() {
  const { isEditMode, toggleEditMode, exportData, importData } = useVirtualMe();

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `virtualme-backup-${new Date().toISOString().split('T')[0]}.json`;
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
        reader.onload = (event) => {
          const content = event.target?.result as string;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <motion.div
      className="fixed top-24 right-8 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="relative">
        {/* Main Edit Button */}
        <motion.button
          onClick={() => toggleEditMode()}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
            isEditMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-slate-800/80 backdrop-blur-md border border-white/20 text-white/70 hover:text-white hover:bg-slate-700/80'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isEditMode ? (
            <>
              <Save className="w-4 h-4" />
              <span>Done Editing</span>
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </>
          )}
        </motion.button>

        {/* Edit Menu (when in edit mode) */}
        {isEditMode && (
          <motion.div
            className="absolute top-full mt-2 right-0 p-2 bg-slate-800/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl min-w-[160px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-xs text-white/40 uppercase tracking-wider px-2 py-1 mb-1">
              Data Management
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">Export Data</span>
            </button>
            <button
              onClick={handleImport}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-left"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Import Data</span>
            </button>
          </motion.div>
        )}

        {/* Edit Mode Indicator */}
        {isEditMode && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-medium animate-pulse">
              EDIT MODE ACTIVE
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
