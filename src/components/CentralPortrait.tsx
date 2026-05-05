import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVirtualMe2 } from '@/store/useVirtualMe2';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export function CentralPortrait() {
  const { data, isEditMode } = useVirtualMe2();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const activeProfileId = data.metadata.activeProfileId;
  const activeProfile = data.profiles.find(p => p.id === activeProfileId);
  const photos = activeProfile?.photos || [];
  const currentPhoto = photos[currentPhotoIndex];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const theme = activeProfile?.theme;

  return (
    <motion.div
      className="relative z-20"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
    >
      {/* Outer Glow Ring */}
      <motion.div
        className="absolute -inset-8 rounded-full blur-2xl"
        style={{
          background: theme ? `linear-gradient(135deg, ${theme.primary}40, ${theme.accent}40)` : 'rgba(100, 200, 255, 0.2)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Rotating Ring */}
      <motion.div
        className="absolute -inset-4 rounded-full border-2 border-dashed border-white/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main Portrait Container */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 bg-slate-800">
        <AnimatePresence mode="wait">
          {currentPhoto && (
            <motion.img
              key={currentPhoto.id}
              src={currentPhoto.url}
              alt={currentPhoto.caption || 'Profile'}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Edit Overlay */}
        {isEditMode && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        )}

        {/* Photo Navigation */}
        {photos.length > 1 && !isEditMode && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}

        {/* Photo Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentPhotoIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Profile Name */}
      <motion.div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white">Kyparissis</h1>
        <p className="text-white/50 text-sm">{activeProfile?.customMessage}</p>
      </motion.div>

      {/* Photo Caption */}
      {currentPhoto?.caption && (
        <motion.div
          className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white/70 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={currentPhoto.id}
        >
          {currentPhoto.caption}
        </motion.div>
      )}
    </motion.div>
  );
}
