import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, GraduationCap, Languages, Heart, Calendar, Zap,
  Edit2, Trash2, Plus
} from 'lucide-react';
import { useVirtualMe2 } from '@/store/useVirtualMe2';
import type { Section, ProfileId } from '@/types/virtualme2';

interface SectionNodeProps {
  section: Section;
  profileId: ProfileId;
}

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  GraduationCap,
  Languages,
  Heart,
  Calendar,
  Zap,
};

export function SectionNode({ section, profileId }: SectionNodeProps) {
  const { 
    zoomToSection, 
    isEditMode, 
    selectedSectionId, 
    setSelectedSectionId,
    updateSectionPosition,
    removeSection,
    data
  } = useVirtualMe2();

  const Icon = iconMap[section.icon] || Briefcase;
  const isSelected = selectedSectionId === section.id;
  
  // Check if section is visible in current profile
  const profile = data.profiles.find(p => p.id === profileId);
  const isVisible = profile?.visibleSections.includes(section.id) ?? true;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      setSelectedSectionId(section.id);
    } else {
      zoomToSection(section.id);
    }
  };

  const handleDrag = (_e: any, info: any) => {
    if (isEditMode) {
      updateSectionPosition(section.id, {
        x: section.position.x + info.delta.x,
        y: section.position.y + info.delta.y,
      });
    }
  };

  if (!isVisible && !isEditMode) return null;

  return (
    <motion.div
      className={`absolute draggable-section ${isEditMode ? 'cursor-move' : 'cursor-pointer'}`}
      style={{
        left: section.position.x,
        top: section.position.y,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={handleClick}
      drag={isEditMode}
      onDrag={handleDrag}
      dragMomentum={false}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isVisible ? 1 : 0.3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl blur-xl"
        style={{ backgroundColor: section.color }}
        animate={{
          opacity: isSelected ? 0.5 : 0.3,
          scale: isSelected ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Node */}
      <div
        className={`relative w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-2 backdrop-blur-xl border-2 transition-all ${
          isSelected 
            ? 'border-white/50 bg-white/20' 
            : 'border-white/20 bg-slate-900/80 hover:border-white/40'
        }`}
        style={{
          boxShadow: `0 0 40px ${section.color}40`,
        }}
      >
        {/* Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${section.color}30` }}
        >
          <Icon className="w-6 h-6" style={{ color: section.color }} />
        </div>

        {/* Title */}
        <span className="text-xs font-semibold text-white/90 text-center px-2 leading-tight">
          {section.title}
        </span>

        {/* Edit Mode Indicators */}
        {isEditMode && (
          <>
            {/* Delete Button */}
            <motion.button
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center z-10"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this section?')) {
                  removeSection(section.id);
                }
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-3 h-3 text-white" />
            </motion.button>

            {/* Edit Button */}
            <motion.button
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center z-10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSectionId(section.id);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 className="w-3 h-3 text-white" />
            </motion.button>
          </>
        )}
      </div>

      {/* Connection Lines to Center */}
      <svg 
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: Math.abs(section.position.x) + 100,
          height: 2,
          transform: `translate(-50%, -50%) rotate(${Math.atan2(-section.position.y, -section.position.x)}rad)`,
          transformOrigin: 'center',
        }}
      >
        <line
          x1="64"
          y1="1"
          x2={Math.sqrt(section.position.x ** 2 + section.position.y ** 2) - 64}
          y2="1"
          stroke={section.color}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.3"
        />
      </svg>
    </motion.div>
  );
}

// Add Section Button (for Edit Mode)
export function AddSectionButton() {
  const { isEditMode, addSection } = useVirtualMe2();
  const [showMenu, setShowMenu] = useState(false);

  if (!isEditMode) return null;

  const sectionTypes = [
    { type: 'knowledge', icon: Briefcase, label: 'Knowledge', color: '#3b82f6' },
    { type: 'education', icon: GraduationCap, label: 'Education', color: '#8b5cf6' },
    { type: 'languages', icon: Languages, label: 'Languages', color: '#10b981' },
    { type: 'interests', icon: Heart, label: 'Interests', color: '#f59e0b' },
    { type: 'timeline', icon: Calendar, label: 'Timeline', color: '#ec4899' },
    { type: 'skills', icon: Zap, label: 'Skills', color: '#06b6d4' },
  ] as const;

  return (
    <div className="fixed bottom-32 right-6 z-50">
      <motion.button
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30"
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {showMenu && (
        <motion.div
          className="absolute bottom-16 right-0 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-2 shadow-xl"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          {sectionTypes.map(({ type, icon: Icon, label, color }) => (
            <button
              key={type}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-left"
              onClick={() => {
                addSection(type as any, { x: 0, y: -200 });
                setShowMenu(false);
              }}
            >
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}30` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-white/80 text-sm">{label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
