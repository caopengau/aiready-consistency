'use client';

import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export interface ScoreCircleProps {
  score: number;
  progress?: number;
  isInView?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export function ScoreCircle({
  score,
  progress: customProgress,
  isInView = true,
  size = 'md',
  showLabel = true,
  className,
}: ScoreCircleProps) {
  const progress = customProgress ?? score;

  const getScoreColor = () => {
    if (score >= 80)
      return { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' };
    if (score >= 60)
      return { stroke: '#eab308', glow: 'rgba(234, 179, 8, 0.3)' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)' };
  };

  const scoreColor = getScoreColor();

  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  const textMap = {
    sm: { score: 'text-3xl', label: 'text-[8px]', title: 'text-sm' },
    md: { score: 'text-5xl', label: 'text-[10px]', title: 'text-lg' },
    lg: { score: 'text-6xl', label: 'text-xs', title: 'text-xl' },
    xl: { score: 'text-7xl', label: 'text-sm', title: 'text-2xl' },
  };

  const currentSize = sizeMap[size];
  const currentText = textMap[size];

  return (
    <div className={cn('relative', currentSize, className)}>
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-50 transition-all duration-500"
        style={{ backgroundColor: scoreColor.glow }}
      />

      <svg
        className="w-full h-full transform -rotate-90 relative z-10"
        viewBox="0 0 100 100"
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i * 360) / 20;
          const startAngle = angle - 85;
          const radius = 42; // Out of 50
          const strokeWidth = 6;
          const gapAngle = 4;

          const startX = 50 + radius * Math.cos((startAngle * Math.PI) / 180);
          const startY = 50 + radius * Math.sin((startAngle * Math.PI) / 180);
          const endX =
            50 +
            radius *
              Math.cos(((startAngle + 360 / 20 - gapAngle) * Math.PI) / 180);
          const endY =
            50 +
            radius *
              Math.sin(((startAngle + 360 / 20 - gapAngle) * Math.PI) / 180);

          const isActive = (i / 20) * 100 <= progress;

          return (
            <motion.line
              key={i}
              x1={`${startX}`}
              y1={`${startY}`}
              x2={`${endX}`}
              y2={`${endY}`}
              stroke={isActive ? scoreColor.stroke : '#334155'}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: isActive ? 1 : 0.3,
                filter: isActive
                  ? `drop-shadow(0 0 2px ${scoreColor.stroke})`
                  : 'none',
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <motion.div
            className={cn('font-black mb-1', currentText.score)}
            style={{ color: scoreColor.stroke }}
            animate={{
              textShadow: `0 0 20px ${scoreColor.glow}, 0 0 40px ${scoreColor.glow}`,
            }}
          >
            {score}
          </motion.div>
          {showLabel && (
            <>
              <div
                className={cn(
                  'font-bold uppercase tracking-wider text-slate-400 mb-0.5',
                  currentText.label
                )}
              >
                AI Readiness
              </div>
              <div
                className={cn('font-black tracking-tight', currentText.title)}
                style={{ color: scoreColor.stroke }}
              >
                SCORE
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
