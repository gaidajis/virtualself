import { useVirtualMe } from '@/store/useVirtualMe';
import { BaseCluster } from '../ui/BaseCluster';

export function GenealogyCluster() {
  const { setSelectedCluster, profileData } = useVirtualMe();

  return (
    <>
      <BaseCluster
        icon={
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
        label="Profile"
        color="bg-gradient-to-br from-rose-500/20 to-red-500/20"
        onClick={() => setSelectedCluster('GENEALOGY')}
      />
      
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-white/40 text-xs">{profileData?.owner?.preferredName || ''}</span>
      </div>
    </>
  );
}
