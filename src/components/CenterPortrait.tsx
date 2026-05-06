import { motion } from 'framer-motion';
import { useVirtualMe } from '@/store/useVirtualMe';

export function CenterPortrait() {
  const { profileData, isEditMode, toggleEditMode } = useVirtualMe();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // In a real app, you'd save this to backend
        console.log('Image uploaded:', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      {/* Animated rings */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ margin: '-20px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full border border-cyan-500/20" />
      </motion.div>
      
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ margin: '-35px' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-full h-full rounded-full border border-blue-500/15" />
      </motion.div>

      {/* Portrait container */}
      <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
        {profileData?.owner.avatarUrl ? (
          <img
            src={profileData.owner.avatarUrl}
            alt={profileData.owner.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-cyan-400/50">
              {profileData?.owner.preferredName?.[0] || '?'}
            </span>
          </div>
        )}

        {/* Edit overlay */}
        {isEditMode && (
          <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <div className="text-white text-center">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs">Upload Photo</span>
            </div>
          </label>
        )}
      </div>

      {/* Name and role */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
        <h2 className="text-white font-semibold text-lg">{profileData?.owner.fullName || 'Loading...'}</h2>
        <p className="text-white/50 text-sm">{profileData?.professionalIdentity.currentPrimaryRole || ''}</p>
      </div>

      {/* Edit button */}
      <button
        onClick={toggleEditMode}
        className={`absolute -bottom-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isEditMode ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-white/70 hover:bg-slate-700'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
  );
}
