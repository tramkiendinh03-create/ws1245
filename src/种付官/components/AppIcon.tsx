import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from './ui';

interface AppIconProps {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  onClick: (id: string) => void;
  notificationCount?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ id, label, icon: Icon, color = "text-white", onClick, notificationCount }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      className="flex flex-col items-center gap-2 group"
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-purple-500/20 relative",
      )}>
        <Icon className={cn("w-8 h-8", color)} strokeWidth={1.5} />
        
        {notificationCount && notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-black">
            {notificationCount}
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-white/80 text-shadow-sm tracking-wide group-hover:text-white">
        {label}
      </span>
    </motion.button>
  );
};
