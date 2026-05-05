import { motion } from 'framer-motion';
import { BaseCluster } from './BaseCluster';
import { Cpu } from 'lucide-react';
import { useVirtualMe } from '@/store/useVirtualMe';

export function ExpertiseCluster() {
  const { rawData, zoom } = useVirtualMe();
  const skills = rawData?.skills?.domains?.slice(0, 4) || [];

  // Neural network nodes
  const neuralNodes = [
    { x: -35, y: -25 },
    { x: -15, y: -35 },
    { x: 15, y: -30 },
    { x: 35, y: -20 },
    { x: 25, y: 10 },
    { x: 0, y: 20 },
    { x: -25, y: 15 },
    { x: -40, y: -5 },
  ];

  return (
    <BaseCluster
      type="expertise"
      label="Expertise"
      icon={<Cpu className="w-8 h-8 text-blue-400" />}
      glowColor="rgba(96, 165, 250, 0.4)"
    >
      {/* Neural network visualization */}
      {!zoom.isZoomed && (
        <svg
          className="absolute -inset-12 w-40 h-40 pointer-events-none"
          viewBox="-50 -50 100 100"
        >
          {/* Neural connections */}
          {neuralNodes.map((node, i) =>
            neuralNodes.slice(i + 1).map((other, j) => {
              const distance = Math.sqrt(
                Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
              );
              if (distance > 40) return null;
              return (
                <motion.line
                  key={`neural-${i}-${j}`}
                  x1={node.x}
                  y1={node.y}
                  x2={other.x}
                  y2={other.y}
                  stroke="rgba(96, 165, 250, 0.3)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: (i + j) * 0.1,
                  }}
                />
              );
            })
          )}

          {/* Neural nodes */}
          {neuralNodes.map((node, i) => (
            <motion.g key={`node-${i}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={3}
                fill="rgba(96, 165, 250, 0.9)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
              />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={6}
                fill="none"
                stroke="rgba(96, 165, 250, 0.3)"
                strokeWidth="1"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            </motion.g>
          ))}

          {/* Data pulse animation along connections */}
          {[...Array(3)].map((_, i) => (
            <motion.circle
              key={`pulse-${i}`}
              r={2}
              fill="rgba(147, 197, 253, 0.8)"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                cx: [-30 + i * 30, -10 + i * 20],
                cy: [-20 + i * 10, 0 + i * 5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            />
          ))}
        </svg>
      )}

      {/* Skill badges */}
      {!zoom.isZoomed && skills.map((skill, i) => (
        <motion.div
          key={i}
          className="absolute px-2 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm"
          style={{
            right: `${-80 + i * 25}px`,
            bottom: `${-10 + i * 20}px`,
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.8, x: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        >
          <span className="text-[9px] text-blue-300 whitespace-nowrap">
            {skill.split(' ').slice(0, 2).join(' ')}
          </span>
        </motion.div>
      ))}

      {/* Electric arcs */}
      {!zoom.isZoomed && (
        <motion.div
          className="absolute -inset-4 rounded-full border border-blue-400/20"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </BaseCluster>
  );
}
