import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Maximize2 } from 'lucide-react';
import { cn } from './ui';

interface AppWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const AppWindow: React.FC<AppWindowProps> = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className={cn(
            "w-[90%] h-[85%] md:w-[80%] md:h-[80%] max-w-4xl flex flex-col bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto",
            className
          )}>
            {/* Window Header */}
            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
              <div className="font-medium text-sm text-white/90 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                {title}
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                  <Maximize2 className="w-3 h-3" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-1.5 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar relative">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
