import { useVirtualMe } from '@/store/useVirtualMe';
import { BaseCluster } from '../BaseCluster';

export function InterestsCluster() {
  const { setSelectedCluster, profileData } = useVirtualMe();

  return (
    <>
      <BaseCluster
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        }
        label="Interests"
        color="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
        onClick={() => setSelectedCluster('INTERESTS')}
      />
      
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-white/40 text-xs">{profileData?.interestsMap?.coreInterests?.length || 0} interests</span>
      </div>
    </>
  );
}
