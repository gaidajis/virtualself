import { useEffect, useRef } from 'react';
import { useVirtualMe } from '@/store/useVirtualMe';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulsePhase: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const { activeContext, isPanelOpen } = useVirtualMe();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Skip frames for performance when panel is open
      const skipFrames = isPanelOpen ? 2 : 1;
      if (frameCount % skipFrames !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulsePhase += 0.02;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const pulseAlpha = particle.alpha * (0.8 + 0.2 * Math.sin(particle.pulsePhase));
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 4
        );
        
        // Color based on context
        let color = '100, 200, 255';
        if (activeContext === 'WORK') color = '100, 180, 255';
        if (activeContext === 'DATING') color = '255, 150, 180';
        if (activeContext === 'PRIVATE') color = '180, 100, 255';
        
        gradient.addColorStop(0, `rgba(${color}, ${pulseAlpha})`);
        gradient.addColorStop(0.5, `rgba(${color}, ${pulseAlpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${pulseAlpha + 0.3})`;
        ctx.fill();

        // Draw connections (only check every 5th particle for performance)
        if (i % 5 === 0 && !isPanelOpen) {
          particles.slice(i + 1).forEach((other, j) => {
            if (j % 3 !== 0) return;
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              const opacity = (1 - distance / 120) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(${color}, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      // Draw center glow
      const centerGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 300
      );
      let centerColor = '59, 130, 246';
      if (activeContext === 'WORK') centerColor = '37, 99, 235';
      if (activeContext === 'DATING') centerColor = '236, 72, 153';
      if (activeContext === 'PRIVATE') centerColor = '147, 51, 234';
      
      centerGradient.addColorStop(0, `rgba(${centerColor}, 0.08)`);
      centerGradient.addColorStop(0.5, `rgba(${centerColor}, 0.03)`);
      centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 300, 0, Math.PI * 2);
      ctx.fillStyle = centerGradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [activeContext, isPanelOpen]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: 'linear-gradient(180deg, #020617 0%, #0a0f1e 50%, #020617 100%)' }}
    />
  );
}
