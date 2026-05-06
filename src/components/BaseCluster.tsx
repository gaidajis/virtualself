import { motion } from 'framer-motion';

interface ClusterProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

export function BaseCluster({ icon, label, color, onClick }: ClusterProps) {
  return (
    <motion.button
      className={`relative w-32 h-32 rounded-2xl ${color} backdrop-blur-md border border-white/10 shadow-xl flex flex-col items-center justify-center gap-3 group hover:scale-105 transition-transform`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {/* Large hit area */}
      <div className="absolute inset-0 -inset-8" />
      
      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
        {icon}
      </div>
      <span className="text-white font-medium text-sm tracking-wide">{label}</span>
    </motion.button>
  );
}
