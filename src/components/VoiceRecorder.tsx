import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Trash2, X, Volume2, MessageSquare, Download, Clock } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

// Sample recordings for demo
const SAMPLE_RECORDINGS = [
  { id: 'sample-1', name: 'Project Ideas', duration: 45, timestamp: Date.now() - 86400000 },
  { id: 'sample-2', name: 'Meeting Notes', duration: 120, timestamp: Date.now() - 172800000 },
];

export function VoiceRecorder() {
  const { 
    isRecording, 
    setIsRecording, 
    recordings, 
    addRecording, 
    deleteRecording,
    notes,
    setNotes
  } = useVirtualMe();
  const [showRecorder, setShowRecorder] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(5));
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Audio visualization
  useEffect(() => {
    if (isRecording && analyserRef.current) {
      const updateLevels = () => {
        const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
        analyserRef.current!.getByteFrequencyData(dataArray);
        
        const levels = new Array(20);
        for (let i = 0; i < 20; i++) {
          const index = Math.floor((i / 20) * dataArray.length);
          levels[i] = Math.max(5, (dataArray[index] / 255) * 50);
        }
        
        setAudioLevels(levels);
        animationFrameRef.current = requestAnimationFrame(updateLevels);
      };
      
      updateLevels();
    } else {
      setAudioLevels(Array(20).fill(5));
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      
      // Set up audio analysis for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const newRecording = {
          id: Date.now().toString(),
          blob: audioBlob,
          timestamp: Date.now(),
        };
        addRecording(newRecording);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = (recording: typeof recordings[0]) => {
    if (playingId === recording.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    const url = URL.createObjectURL(recording.blob);
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };

    audio.play();
    setPlayingId(recording.id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;
    
    if (diff < 86400000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 172800000) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const downloadRecording = (recording: typeof recordings[0]) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${recording.id}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRecordings = recordings.length + SAMPLE_RECORDINGS.length;

  return (
    <>
      {/* Floating Recorder Button */}
      <motion.button
        className="fixed top-8 right-8 z-50 p-3 rounded-full bg-slate-800/80 backdrop-blur-md border border-white/20 hover:bg-slate-700/80 transition-colors group"
        onClick={() => setShowRecorder(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Mic className="w-5 h-5 text-cyan-400" />
        {totalRecordings > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-white text-xs flex items-center justify-center font-bold">
            {totalRecordings}
          </span>
        )}
        
        {/* Tooltip */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-white/70 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Voice Notes
        </div>
      </motion.button>

      {/* Recorder Panel */}
      <AnimatePresence>
        {showRecorder && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowRecorder(false)}
            />

            {/* Panel */}
            <motion.div
              className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Voice Notes</h3>
                    <p className="text-sm text-white/50">Record your thoughts & ideas</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecorder(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Recording Interface */}
              <div className="p-6">
                {/* Audio Visualizer */}
                <div className="h-28 bg-slate-800/70 rounded-2xl mb-6 flex items-center justify-center gap-1 overflow-hidden border border-white/5">
                  {audioLevels.map((level, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-full"
                      animate={{ height: level }}
                      transition={{ duration: 0.05 }}
                    />
                  ))}
                </div>

                {/* Recording Timer */}
                {isRecording && (
                  <div className="text-center mb-6">
                    <motion.div 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-2xl font-mono text-red-400 font-bold">
                        {formatTime(recordingTime)}
                      </span>
                    </motion.div>
                  </div>
                )}

                {/* Permission Warning */}
                {hasPermission === false && (
                  <div className="mb-4 p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm text-center">
                    Please allow microphone access to record
                  </div>
                )}

                {/* Record Button */}
                <div className="flex justify-center mb-8">
                  <motion.button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isRecording 
                        ? 'bg-red-500 shadow-lg shadow-red-500/30' 
                        : 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRecording ? (
                      <Square className="w-10 h-10 text-white fill-white" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                    
                    {/* Pulsing ring */}
                    {isRecording && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-500"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                </div>

                {/* Recordings List */}
                {totalRecordings > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/50 uppercase tracking-wider font-medium">
                        Recordings
                      </div>
                      <div className="text-xs text-white/40">
                        {totalRecordings} total
                      </div>
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {/* User recordings */}
                      {recordings.map((recording, idx) => (
                        <motion.div
                          key={recording.id}
                          className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <button
                            onClick={() => playRecording(recording)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                              playingId === recording.id
                                ? 'bg-cyan-500 text-white'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                            }`}
                          >
                            {playingId === recording.id ? (
                              <Volume2 className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">
                              Recording {idx + 1}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(recording.timestamp)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => downloadRecording(recording)}
                              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4 text-white/50" />
                            </button>
                            <button
                              onClick={() => deleteRecording(recording.id)}
                              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Sample recordings */}
                      {SAMPLE_RECORDINGS.map((recording) => (
                        <motion.div
                          key={recording.id}
                          className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-white/5 opacity-70"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 0.7, x: 0 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Play className="w-4 h-4 text-white/40 ml-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white/70 font-medium truncate">
                              {recording.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(recording.timestamp)} • {formatTime(recording.duration)}
                            </div>
                          </div>
                          <span className="text-xs text-white/30 px-2 py-1 rounded-full bg-white/5">
                            Demo
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Text Notes */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-white/50 text-sm mb-3">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">Quick Notes</span>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type your thoughts here... (auto-saved)"
                    className="w-full h-24 p-3 bg-slate-800/50 rounded-xl text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-white/5 transition-all"
                  />
                  {notes && (
                    <div className="mt-2 text-xs text-cyan-400/70 flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      Auto-saving...
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
