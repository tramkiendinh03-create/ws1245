import React from 'react';
import { MapPin, Clock, CloudFog } from 'lucide-react';
import { GlassCard } from './ui';
import { GameState } from '../types';

export const SpaceTimeHeader = ({ state }: { state: GameState }) => {
  return (
    <GlassCard className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-l-4 border-l-purple-500">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Clock className="w-5 h-5 text-purple-300" />
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest">当前时间</div>
          <div className="text-xl font-display font-bold text-white tracking-wide">{state.time}</div>
        </div>
      </div>

      <div className="h-8 w-px bg-white/10 hidden md:block" />

      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-300" />
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest">当前地点</div>
          <div className="text-lg font-medium text-white">{state.location}</div>
        </div>
      </div>

      <div className="h-8 w-px bg-white/10 hidden md:block" />

      <div className="flex items-center gap-3 flex-1">
        <div className="p-2 bg-gray-500/20 rounded-lg">
          <CloudFog className="w-5 h-5 text-gray-300" />
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest">环境氛围</div>
          <div className="text-sm text-gray-300 italic">"{state.atmosphere}"</div>
        </div>
      </div>
    </GlassCard>
  );
};
