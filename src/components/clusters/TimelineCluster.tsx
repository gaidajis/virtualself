import { useVirtualMe } from '@/store/useVirtualMe';
import { BaseCluster } from '../BaseCluster';

export function TimelineCluster() {
  const { setSelectedCluster, profileData } = useVirtualMe();

  return (
    <>
      <BaseCluster
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        label="Timeline"
        color="bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
        onClick={() => setSelectedCluster('TIMELINE')}
      />
      
      {/* Quick preview */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-white/40 text-xs">{profileData?.lifeTimeline?.length || 0} life phases</span>
      </div>
    </>
  );
}
