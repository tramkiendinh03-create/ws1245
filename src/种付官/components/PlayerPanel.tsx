import React from 'react';
import { Zap, Award, Package, UserCircle, Dna, Activity } from 'lucide-react';
import { GlassCard, ProgressBar, Badge } from './ui';
import { PlayerProfile } from '../types';

export const PlayerPanel = ({ player }: { player: PlayerProfile }) => {
  return (
    <GlassCard className="h-full border-t-4 border-t-blue-600 bg-black/60 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <UserCircle className="w-8 h-8 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
             <h3 className="font-display font-black text-2xl text-white tracking-tight">{player.name}</h3>
             <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/50 px-2 py-1 rounded border border-blue-500/20">
               当前等级 {player.level}
             </span>
          </div>
          <div className="text-xs text-blue-300/60 font-medium tracking-wider uppercase mt-1 flex items-center gap-2">
            {player.identity} 
            <span className="w-1 h-1 rounded-full bg-blue-500/50" />
            {player.gender}
          </div>
        </div>
      </div>

      <div className="mb-6 relative z-10">
         <ProgressBar 
            value={player.xp} 
            max={player.maxXp} 
            height="h-2" 
            color="bg-gradient-to-r from-blue-600 to-cyan-500" 
            showValue={false}
         />
         <div className="flex justify-between text-[10px] text-blue-300/50 mt-1 font-mono tracking-wider">
            <span>经验值</span>
            <span>{player.xp} / {player.maxXp}</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
         <div className="bg-blue-950/20 rounded-xl p-3 border border-blue-500/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1 font-bold">种付点数</div>
            <div className="text-2xl font-mono font-bold text-yellow-400 flex items-center gap-2 drop-shadow-sm">
               <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {player.points}
            </div>
         </div>
         <div className="bg-blue-950/20 rounded-xl p-3 border border-blue-500/10 relative overflow-hidden">
            <div className="text-[10px] text-blue-400 uppercase tracking-widest mb-1 font-bold">当前任务</div>
            <div className="text-sm text-white font-medium truncate relative z-10">
               {player.currentTask}
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-blue-500/50 w-1/3 animate-pulse" />
         </div>
      </div>

      <div className="space-y-5 relative z-10">
         <div>
            <div className="text-[10px] text-gray-500 uppercase mb-2 flex items-center gap-1 font-bold tracking-wider">
               <Package className="w-3 h-3" /> 持有道具
            </div>
            <div className="flex flex-wrap gap-2">
               {player.items.map(item => (
                  <span key={item} className="px-2 py-1 bg-gray-800/80 border border-gray-700 rounded text-[10px] text-gray-300 hover:border-gray-500 transition-colors cursor-default">
                     {item}
                  </span>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="bg-amber-950/10 rounded-xl p-3 border border-amber-500/10">
                <div className="text-[10px] text-amber-500 uppercase mb-2 flex items-center gap-1 font-bold tracking-wider">
                   <Activity className="w-3 h-3" /> 临时加成
                </div>
                <div className="flex flex-wrap gap-1.5">
                   {player.tempBuffs.length > 0 ? player.tempBuffs.map(buff => (
                      <span key={buff} className="px-1.5 py-0.5 bg-amber-500/10 text-amber-300 text-[10px] rounded border border-amber-500/20">{buff}</span>
                   )) : <span className="text-xs text-gray-600">无</span>}
                </div>
            </div>

            <div className="bg-emerald-950/10 rounded-xl p-3 border border-emerald-500/10">
                <div className="text-[10px] text-emerald-500 uppercase mb-2 flex items-center gap-1 font-bold tracking-wider">
                   <Dna className="w-3 h-3" /> 永久特性
                </div>
                <div className="flex flex-wrap gap-1.5">
                   {player.permTraits.length > 0 ? player.permTraits.map(trait => (
                      <span key={trait} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-300 text-[10px] rounded border border-emerald-500/20">{trait}</span>
                   )) : <span className="text-xs text-gray-600">无</span>}
                </div>
            </div>
         </div>
      </div>
    </GlassCard>
  );
};
