import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const StatusBar = ({ time }: { time: string }) => {
  return (
    <div className="h-8 px-6 flex items-center justify-between text-xs font-medium text-white/80 select-none">
      <div className="flex items-center gap-2 font-mono tracking-wider">
        <span>{time}</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Signal className="w-3.5 h-3.5" />
          <span className="text-[10px]">5G</span>
        </div>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-1">
          <span className="text-[10px]">100%</span>
          <Battery className="w-3.5 h-3.5 rotate-90" />
        </div>
      </div>
    </div>
  );
};
