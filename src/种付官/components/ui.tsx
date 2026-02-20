import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; hoverEffect?: boolean }> = ({ children, className, hoverEffect = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-panel rounded-2xl p-4 transition-all duration-300",
        hoverEffect && "hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const ProgressBar: React.FC<{ 
  value: number; 
  max?: number; 
  min?: number; 
  color?: string; 
  label?: string;
  showValue?: boolean;
  height?: string;
}> = ({ 
  value, 
  max = 100, 
  min = 0, 
  color = "bg-purple-500", 
  label, 
  showValue = true,
  height = "h-2"
}) => {
  // Normalize value to percentage relative to min/max range
  const range = max - min;
  const normalizedValue = Math.min(Math.max(value, min), max);
  const percentage = ((normalizedValue - min) / range) * 100;

  return (
    <div className="w-full space-y-1">
      {(label || showValue) && (
        <div className="flex justify-between text-xs uppercase tracking-wider font-medium text-gray-400">
          {label && <span>{label}</span>}
          {showValue && <span className="font-mono">{value}</span>}
        </div>
      )}
      <div className={cn("w-full bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5", height)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)]", color)}
        />
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'outline' | 'danger' | 'success' | 'warning' }> = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-white/10 text-white border-transparent",
    outline: "bg-transparent border-white/20 text-gray-300",
    danger: "bg-red-500/20 text-red-200 border-red-500/30",
    success: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-200 border-amber-500/30",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest font-bold border backdrop-blur-md", variants[variant])}>
      {children}
    </span>
  );
};
