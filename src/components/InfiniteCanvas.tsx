import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useVirtualMe2 } from '@/store/useVirtualMe2';

interface InfiniteCanvasProps {
  children: React.ReactNode;
}

export function InfiniteCanvas({ children }: InfiniteCanvasProps) {
  const { cameraPosition, setCameraPosition, zoomLevel, zoomToOverview } = useVirtualMe2();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const cameraStart = useRef({ x: 0, y: 0 });

  // Smooth spring animation for camera
  const springConfig = { stiffness: 150, damping: 20 };
  const x = useSpring(cameraPosition.x, springConfig);
  const y = useSpring(cameraPosition.y, springConfig);
  const scale = useSpring(cameraPosition.scale, springConfig);

  // Update springs when camera position changes
  useEffect(() => {
    x.set(cameraPosition.x);
    y.set(cameraPosition.y);
    scale.set(cameraPosition.scale);
  }, [cameraPosition, x, y, scale]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(5, cameraPosition.scale * zoomFactor));
    
    // Zoom towards mouse position
    const scaleRatio = newScale / cameraPosition.scale;
    const newX = cameraPosition.x - mouseX * (scaleRatio - 1);
    const newY = cameraPosition.y - mouseY * (scaleRatio - 1);
    
    setCameraPosition({ x: newX, y: newY, scale: newScale });
  }, [cameraPosition, setCameraPosition]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.draggable-section')) return;
    
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    cameraStart.current = { x: cameraPosition.x, y: cameraPosition.y };
  }, [cameraPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = (e.clientX - dragStart.current.x);
    const dy = (e.clientY - dragStart.current.y);
    
    setCameraPosition({
      x: cameraStart.current.x + dx,
      y: cameraStart.current.y + dy,
      scale: cameraPosition.scale,
    });
  }, [isDragging, cameraPosition.scale, setCameraPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      cameraStart.current = { x: cameraPosition.x, y: cameraPosition.y };
    }
  }, [cameraPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const dx = (e.touches[0].clientX - dragStart.current.x);
    const dy = (e.touches[0].clientY - dragStart.current.y);
    
    setCameraPosition({
      x: cameraStart.current.x + dx,
      y: cameraStart.current.y + dy,
      scale: cameraPosition.scale,
    });
  }, [isDragging, cameraPosition.scale, setCameraPosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ESC key to return to overview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomLevel !== 'overview') {
        zoomToOverview();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomLevel, zoomToOverview]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Transform Container */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{
          x,
          y,
          scale,
        }}
      >
        {/* Content centered at origin */}
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          {children}
        </div>
      </motion.div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-24 left-6 px-3 py-2 rounded-lg bg-slate-900/80 backdrop-blur-md border border-white/10 text-white/60 text-sm">
        {Math.round(cameraPosition.scale * 100)}%
      </div>
    </div>
  );
}
