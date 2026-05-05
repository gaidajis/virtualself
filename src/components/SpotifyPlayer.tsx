import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Heart, Shuffle, Repeat } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

const SAMPLE_TRACKS = [
  { 
    id: '1', 
    title: 'Midnight in Tokyo', 
    artist: 'Lo-Fi Dreams', 
    duration: 184, 
    color: 'from-pink-400 to-rose-500',
    genre: 'Lo-Fi'
  },
  { 
    id: '2', 
    title: 'Swiss Alps Meditation', 
    artist: 'Ambient Works', 
    duration: 243, 
    color: 'from-cyan-400 to-blue-500',
    genre: 'Ambient'
  },
  { 
    id: '3', 
    title: 'Energy Flow', 
    artist: 'Focus Beats', 
    duration: 198, 
    color: 'from-emerald-400 to-green-500',
    genre: 'Electronic'
  },
  { 
    id: '4', 
    title: 'Greek Sunset', 
    artist: 'Mediterranean Vibes', 
    duration: 256, 
    color: 'from-amber-400 to-orange-500',
    genre: 'Chill'
  },
  { 
    id: '5', 
    title: 'Deep Work Session', 
    artist: 'Productivity Sounds', 
    duration: 312, 
    color: 'from-violet-400 to-purple-500',
    genre: 'Focus'
  },
  { 
    id: '6', 
    title: 'Hydro Power', 
    artist: 'Nature Sounds', 
    duration: 420, 
    color: 'from-blue-400 to-indigo-500',
    genre: 'Nature'
  },
];

export function SpotifyPlayer() {
  const { isMusicPlaying, setIsMusicPlaying, currentTrack, setCurrentTrack, musicVolume, setMusicVolume } = useVirtualMe();
  const [progress, setProgress] = useState(0);
  const [likedTracks, setLikedTracks] = useState<string[]>(['1', '3']);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeTrack = SAMPLE_TRACKS.find(t => t.id === currentTrack) || SAMPLE_TRACKS[0];

  useEffect(() => {
    if (isMusicPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress(p => {
          if (p >= activeTrack.duration) {
            if (isRepeating) {
              return 0;
            }
            // Auto skip to next track
            const currentIndex = SAMPLE_TRACKS.findIndex(t => t.id === currentTrack);
            const nextTrack = SAMPLE_TRACKS[(currentIndex + 1) % SAMPLE_TRACKS.length];
            setCurrentTrack(nextTrack.id);
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isMusicPlaying, currentTrack, activeTrack.duration, isRepeating, setCurrentTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!currentTrack) {
      setCurrentTrack(SAMPLE_TRACKS[0].id);
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleSkip = (direction: 'prev' | 'next') => {
    const currentIndex = SAMPLE_TRACKS.findIndex(t => t.id === currentTrack);
    let newIndex;
    if (isShuffling) {
      newIndex = Math.floor(Math.random() * SAMPLE_TRACKS.length);
    } else if (direction === 'prev') {
      newIndex = currentIndex <= 0 ? SAMPLE_TRACKS.length - 1 : currentIndex - 1;
    } else {
      newIndex = (currentIndex + 1) % SAMPLE_TRACKS.length;
    }
    setCurrentTrack(SAMPLE_TRACKS[newIndex].id);
    setProgress(0);
  };

  const toggleLike = (trackId: string) => {
    setLikedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    setProgress(Math.floor(percentage * activeTrack.duration));
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Visualizer Header */}
      <div className={`h-40 bg-gradient-to-br ${activeTrack.color} relative overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/20"
              style={{
                width: 100 + i * 50,
                height: 100 + i * 50,
                left: '50%',
                top: '50%',
                marginLeft: -(50 + i * 25),
                marginTop: -(50 + i * 25),
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        
        {/* Visualizer bars */}
        <div className="absolute inset-0 flex items-end justify-center gap-1 pb-6">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 bg-white/40 rounded-full"
              animate={{
                height: isMusicPlaying 
                  ? [15, 30 + Math.random() * 80, 15] 
                  : 15,
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                delay: i * 0.03,
              }}
            />
          ))}
        </div>
        
        {/* Genre badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
          <span className="text-xs text-white/80 font-medium">{activeTrack.genre}</span>
        </div>
        
        {/* Spotify logo area */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Music className="w-5 h-5 text-white/80" />
          <span className="text-white/80 text-sm font-medium">Spotify</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="p-6">
        {/* Track Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-xl font-bold text-white">{activeTrack.title}</h4>
            <p className="text-white/60">{activeTrack.artist}</p>
          </div>
          <motion.button
            onClick={() => toggleLike(activeTrack.id)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Heart 
              className={`w-6 h-6 ${likedTracks.includes(activeTrack.id) ? 'text-red-500 fill-red-500' : 'text-white/40'}`} 
            />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            className="h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
            onClick={handleProgressClick}
          >
            <motion.div
              className={`h-full bg-gradient-to-r ${activeTrack.color} relative`}
              style={{ width: `${(progress / activeTrack.duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(activeTrack.duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            onClick={() => setIsShuffling(!isShuffling)}
            className={`p-2 rounded-full transition-colors ${isShuffling ? 'text-green-400' : 'text-white/40 hover:text-white/70'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Shuffle className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={() => handleSkip('prev')}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipBack className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${activeTrack.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMusicPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </motion.button>

          <motion.button
            onClick={() => handleSkip('next')}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <SkipForward className="w-6 h-6 text-white" />
          </motion.button>

          <motion.button
            onClick={() => setIsRepeating(!isRepeating)}
            className={`p-2 rounded-full transition-colors ${isRepeating ? 'text-green-400' : 'text-white/40 hover:text-white/70'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Repeat className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-4 h-4 text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicVolume}
            onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, rgba(255,255,255,0.5) ${musicVolume * 100}%, rgba(255,255,255,0.1) ${musicVolume * 100}%)`
            }}
          />
        </div>

        {/* Playlist Toggle */}
        <button
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="w-full py-2 text-sm text-white/50 hover:text-white/80 transition-colors border-t border-white/10"
        >
          {showPlaylist ? 'Hide' : 'Show'} Playlist ({SAMPLE_TRACKS.length} tracks)
        </button>

        {/* Track List */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              className="mt-4 space-y-2 max-h-48 overflow-y-auto"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {SAMPLE_TRACKS.map((track, i) => (
                <motion.button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrack(track.id);
                    setProgress(0);
                    setIsMusicPlaying(true);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    currentTrack === track.id 
                      ? 'bg-white/10 border border-white/20' 
                      : 'hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${track.color} flex items-center justify-center flex-shrink-0`}>
                    {currentTrack === track.id && isMusicPlaying ? (
                      <div className="flex gap-0.5">
                        <div className="w-1 h-4 bg-white animate-pulse" />
                        <div className="w-1 h-4 bg-white animate-pulse delay-75" />
                        <div className="w-1 h-4 bg-white animate-pulse delay-150" />
                      </div>
                    ) : (
                      <Music className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm truncate ${currentTrack === track.id ? 'text-white font-medium' : 'text-white/80'}`}>
                      {track.title}
                    </div>
                    <div className="text-xs text-white/50">{track.artist}</div>
                  </div>
                  <div className="text-xs text-white/40">{formatTime(track.duration)}</div>
                  {likedTracks.includes(track.id) && (
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
