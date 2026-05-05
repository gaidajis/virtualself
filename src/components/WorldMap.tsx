import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

interface WorldMapProps {
  locations: string[];
  countriesVisited: number;
}

// Simplified world map coordinates for major locations
const LOCATION_COORDS: Record<string, { x: number; y: number; label: string }> = {
  'Greece': { x: 55, y: 35, label: 'GR' },
  'Cyprus': { x: 58, y: 38, label: 'CY' },
  'Cameroon': { x: 48, y: 55, label: 'CM' },
  'Oslo': { x: 50, y: 22, label: 'NO' },
  'Norway': { x: 50, y: 22, label: 'NO' },
  'United States': { x: 25, y: 35, label: 'US' },
  'Switzerland': { x: 50, y: 30, label: 'CH' },
  'Vaud': { x: 50, y: 30, label: 'CH' },
};

interface MapLocation {
  x: number;
  y: number;
  label: string;
  name: string;
}

export function WorldMap({ locations, countriesVisited }: WorldMapProps) {
  const uniqueLocations = [...new Set(locations)];
  const mapLocations: MapLocation[] = uniqueLocations.map(loc => {
    const coord = Object.entries(LOCATION_COORDS).find(([key]) => 
      loc.toLowerCase().includes(key.toLowerCase())
    );
    return coord ? { ...coord[1], name: loc } : null;
  }).filter((item): item is MapLocation => item !== null);

  return (
    <div className="relative w-full h-full bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
      {/* Map Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
          {/* Latitude lines */}
          {[...Array(7)].map((_, i) => (
            <line
              key={`lat-${i}`}
              x1="0"
              y1={i * 10}
              x2="100"
              y2={i * 10}
              stroke="rgba(100, 200, 255, 0.2)"
              strokeWidth="0.2"
            />
          ))}
          {/* Longitude lines */}
          {[...Array(11)].map((_, i) => (
            <line
              key={`lon-${i}`}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="60"
              stroke="rgba(100, 200, 255, 0.2)"
              strokeWidth="0.2"
            />
          ))}
        </svg>
      </div>

      {/* Simplified World Map Outline */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 60"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Continents - Simplified paths */}
        <defs>
          <linearGradient id="continentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(52, 211, 153, 0.15)" />
            <stop offset="100%" stopColor="rgba(52, 211, 153, 0.05)" />
          </linearGradient>
        </defs>

        {/* North America */}
        <motion.path
          d="M 5 15 Q 15 10, 25 15 Q 30 20, 28 30 Q 25 35, 20 32 Q 15 30, 10 28 Q 5 25, 5 15"
          fill="url(#continentGrad)"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* South America */}
        <motion.path
          d="M 22 38 Q 28 38, 30 45 Q 28 55, 25 58 Q 22 55, 20 48 Q 18 42, 22 38"
          fill="url(#continentGrad)"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        {/* Europe */}
        <motion.path
          d="M 45 18 Q 55 15, 58 20 Q 56 28, 52 30 Q 48 28, 45 25 Q 43 22, 45 18"
          fill="url(#continentGrad)"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />

        {/* Africa */}
        <motion.path
          d="M 46 32 Q 55 32, 58 40 Q 56 55, 52 58 Q 48 55, 45 48 Q 43 40, 46 32"
          fill="url(#continentGrad)"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        />

        {/* Asia */}
        <motion.path
          d="M 60 15 Q 75 10, 90 18 Q 95 25, 88 35 Q 80 40, 70 38 Q 62 35, 60 25 Q 58 18, 60 15"
          fill="url(#continentGrad)"
          stroke="rgba(52, 211, 153, 0.2)"
          strokeWidth="0.3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        />

        {/* Location Markers */}
        {mapLocations.map((loc, i) => (
          <motion.g key={loc.name}>
            {/* Pulse ring */}
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r="3"
              fill="none"
              stroke="rgba(52, 211, 153, 0.5)"
              strokeWidth="0.5"
              animate={{ 
                r: [3, 6, 3],
                opacity: [0.8, 0, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
            {/* Marker */}
            <motion.circle
              cx={loc.x}
              cy={loc.y}
              r="2"
              fill="rgba(52, 211, 153, 0.9)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            />
            {/* Label */}
            <motion.text
              x={loc.x}
              y={loc.y - 4}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.8)"
              fontSize="3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {loc.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Connection lines between visited locations */}
        {mapLocations.length > 1 && mapLocations.slice(0, -1).map((loc, i) => {
          const nextLoc = mapLocations[i + 1];
          if (!nextLoc) return null;
          return (
            <motion.line
              key={`line-${i}`}
              x1={loc.x}
              y1={loc.y}
              x2={nextLoc.x}
              y2={nextLoc.y}
              stroke="rgba(52, 211, 153, 0.3)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2 + i * 0.2, duration: 1 }}
            />
          );
        })}
      </svg>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <MapPin className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Locations</span>
          </div>
          <div className="text-2xl font-bold text-white">{mapLocations.length}</div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Navigation className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Countries</span>
          </div>
          <div className="text-2xl font-bold text-white">{countriesVisited}</div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
