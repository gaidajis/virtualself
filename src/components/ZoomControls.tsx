import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function ZoomControls() {
  const { zoom, setZoom, resetZoom } = useVirtualMe();

  const handleZoomIn = () => {
    setZoom({
      zoomScale: Math.min(zoom.zoomScale + 0.3, 3),
    });
  };

  const handleZoomOut = () => {
    if (zoom.zoomScale <= 1 && zoom.isZoomed) {
      resetZoom();
    } else {
      setZoom({
        zoomScale: Math.max(zoom.zoomScale - 0.3, 1),
      });
    }
  };

  return (
    <motion.div
      className="fixed bottom-28 right-8 z-50 flex flex-col gap-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2 }}
    >
      {/* Zoom In */}
      <motion.button
        onClick={handleZoomIn}
        className="p-3 rounded-xl bg-slate-800/90 backdrop-blur-md border border-white/20 hover:bg-slate-700/90 hover:border-white/40 transition-all shadow-lg group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Zoom In"
      >
        <ZoomIn className="w-5 h-5 text-white/70 group-hover:text-white" />
      </motion.button>

      {/* Zoom Out */}
      <motion.button
        onClick={handleZoomOut}
        className="p-3 rounded-xl bg-slate-800/90 backdrop-blur-md border border-white/20 hover:bg-slate-700/90 hover:border-white/40 transition-all shadow-lg group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Zoom Out"
      >
        <ZoomOut className="w-5 h-5 text-white/70 group-hover:text-white" />
      </motion.button>

      {/* Reset / Fullscreen */}
      <motion.button
        onClick={zoom.isZoomed ? resetZoom : () => setZoom({ zoomScale: 2 })}
        className={`p-3 rounded-xl backdrop-blur-md border-2 transition-all shadow-lg group ${
          zoom.isZoomed 
            ? 'bg-cyan-500/20 border-cyan-500/50 hover:bg-cyan-500/30' 
            : 'bg-slate-800/90 border-white/20 hover:bg-slate-700/90 hover:border-white/40'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={zoom.isZoomed ? 'Reset View' : 'Zoom to 200%'}
      >
        {zoom.isZoomed ? (
          <RotateCcw className="w-5 h-5 text-cyan-400" />
        ) : (
          <Maximize2 className="w-5 h-5 text-white/70 group-hover:text-white" />
        )}
      </motion.button>

      {/* Zoom Level Indicator */}
      <motion.div 
        className="px-3 py-2 rounded-xl bg-slate-800/90 backdrop-blur-md border border-white/20 text-center shadow-lg"
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-sm font-bold text-white/80">{Math.round(zoom.zoomScale * 100)}%</span>
      </motion.div>

      {/* Label */}
      <motion.div 
        className="text-center text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Zoom
      </motion.div>
    </motion.div>
  );
}
