import { motion } from 'framer-motion';
import { useVirtualMe } from '@/store/useVirtualMe';
import { Camera } from 'lucide-react';

export function CenterPortrait() {
  const { activeContext, isTransitioning, userProfile, rawData, updateUserProfile, isEditMode } = useVirtualMe();
  
  
  // Get name from either userProfile or rawData
  const displayName = userProfile?.preferredName || rawData?.profile?.preferredName || rawData?.profile?.fullName || 'VirtualSelf';
  const currentRole = rawData?.workExperience?.[0]?.title || '';
  const avatarUrl = userProfile?.avatarUrl || '/avatar.jpg';

  // Ring colors based on context
  const getRingColors = () => {
    switch (activeContext) {
      case 'WORK':
        return {
          inner: 'from-blue-400/60 to-cyan-400/40',
          middle: 'from-blue-500/40 to-cyan-500/20',
          outer: 'from-blue-600/20 to-cyan-600/10',
        };
      case 'DATING':
        return {
          inner: 'from-pink-400/60 to-rose-400/40',
          middle: 'from-pink-500/40 to-rose-500/20',
          outer: 'from-pink-600/20 to-rose-600/10',
        };
      case 'PRIVATE':
        return {
          inner: 'from-violet-400/60 to-purple-400/40',
          middle: 'from-violet-500/40 to-purple-500/20',
          outer: 'from-violet-600/20 to-purple-600/10',
        };
      default:
        return {
          inner: 'from-cyan-400/60 to-blue-400/40',
          middle: 'from-cyan-500/40 to-blue-500/20',
          outer: 'from-cyan-600/20 to-blue-600/10',
        };
    }
  };

  const colors = getRingColors();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
    // setIsEditingImage(false);
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className={`absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r ${colors.outer} blur-3xl`}
        animate={{
          scale: isTransitioning ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: isTransitioning ? [0.3, 0.5, 0.3] : [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: isTransitioning ? 0.5 : 4,
          repeat: isTransitioning ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Middle ring */}
      <motion.div
        className={`absolute w-[380px] h-[380px] rounded-full border-2 border-transparent bg-gradient-to-r ${colors.middle}`}
        style={{
          background: `linear-gradient(90deg, transparent, rgba(100, 200, 255, 0.1), transparent)`,
        }}
        animate={{
          rotate: 360,
          scale: isTransitioning ? [1, 1.05, 1] : 1,
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          scale: { duration: 0.5 },
        }}
      />

      {/* Inner ring with gradient border */}
      <motion.div
        className={`absolute w-[320px] h-[320px] rounded-full p-[2px] bg-gradient-to-r ${colors.inner}`}
        animate={{
          rotate: -360,
          scale: isTransitioning ? [1, 1.08, 1] : [1, 1.02, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: isTransitioning ? { duration: 0.4 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <div className="w-full h-full rounded-full bg-slate-950/80" />
      </motion.div>

      {/* Portrait container */}
      <motion.div
        className="relative w-[280px] h-[280px] rounded-full overflow-hidden group"
        animate={{
          boxShadow: isTransitioning
            ? [
                '0 0 60px rgba(100, 200, 255, 0.3)',
                '0 0 100px rgba(100, 200, 255, 0.6)',
                '0 0 60px rgba(100, 200, 255, 0.3)',
              ]
            : [
                '0 0 40px rgba(100, 200, 255, 0.2)',
                '0 0 60px rgba(100, 200, 255, 0.3)',
                '0 0 40px rgba(100, 200, 255, 0.2)',
              ],
        }}
        transition={{
          duration: isTransitioning ? 0.5 : 3,
          repeat: isTransitioning ? 0 : Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Portrait image */}
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
        />

        {/* Edit overlay */}
        {isEditMode && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2 text-white">
                <Camera className="w-8 h-8" />
                <span className="text-xs">Change Photo</span>
              </div>
            </label>
          </div>
        )}

        {/* Holographic scan line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent pointer-events-none"
          animate={{
            y: [-280, 280],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/60" />
      </motion.div>

      {/* Name label below portrait */}
      <motion.div
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white tracking-wide">{displayName}</h2>
        {currentRole && (
          <p className="text-sm text-cyan-400/70 mt-1">{currentRole}</p>
        )}
      </motion.div>

      {/* Orbiting particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-cyan-400/80"
          style={{
            boxShadow: '0 0 10px rgba(100, 200, 255, 0.8)',
          }}
          animate={{
            x: Math.cos((i * Math.PI) / 3) * 180,
            y: Math.sin((i * Math.PI) / 3) * 180,
          }}
          transition={{
            duration: 0,
          }}
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              width: 360,
              height: 360,
              left: -180,
              top: -180,
            }}
          >
            <div
              className="absolute w-2 h-2 rounded-full bg-cyan-400/80"
              style={{
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                boxShadow: '0 0 10px rgba(100, 200, 255, 0.8)',
              }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
