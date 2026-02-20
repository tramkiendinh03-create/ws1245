import React from 'react';
import { Heart, Users, Baby, User, Flame } from 'lucide-react';
import { GlassCard, ProgressBar } from './ui';
import { TargetProfile } from '../types';

export const TargetProfileCard = ({ target }: { target: TargetProfile }) => {
  // Helper to determine submission stage text
  const getSubmissionStage = (val: number) => {
    if (val < 0) return "逆转支配 / 女王觉醒";
    if (val <= 40) return "抵抗阶段 / 逻辑自洽";
    if (val <= 80) return "快乐重塑 / 身体背叛";
    return "彻底沦陷 / 母猪化";
  };

  return (
    <GlassCard className="h-full relative overflow-hidden group border-pink-900/30 bg-black/60">
      {/* Background decoration - Lustful Pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-pink-900/20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex gap-5">
          <div className="w-24 h-24 rounded-2xl bg-gray-900 border-2 border-pink-500/30 overflow-hidden relative shadow-[0_0_20px_rgba(236,72,153,0.2)]">
             {target.avatarUrl ? (
                 <img src={target.avatarUrl} alt={target.name} className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                     <User size={32} />
                 </div>
             )}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-900/90 to-transparent pt-4 pb-1 text-[10px] text-center text-pink-100 font-bold tracking-widest">
                攻略难度: {target.difficulty}
             </div>
          </div>
          <div>
            <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400 flex items-center gap-2 drop-shadow-sm">
              {target.name}
              {target.isPregnant && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[10px] font-bold flex items-center gap-1">
                  <Baby className="w-3 h-3" /> 孕育中
                </span>
              )}
            </h2>
            <div className="text-sm text-pink-400/80 font-medium mb-2 tracking-wide flex items-center gap-2">
              {target.occupation}
              <span className="w-1 h-1 rounded-full bg-pink-500/50" />
              <span className="text-gray-400">{target.relationship}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
               <div className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-1">
                 <Flame className="w-3 h-3" />
                 表面情绪: {target.surfaceEmotion}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-6 p-4 rounded-xl bg-black/20 border border-white/5">
          <ProgressBar 
            value={target.resistanceIndex} 
            max={100} 
            label="反抗指数" 
            color="bg-gradient-to-r from-gray-500 to-red-600" 
            height="h-3"
          />
          
          <div>
            <ProgressBar 
              value={target.submissionLevel} 
              min={-100} 
              max={100} 
              label="臣服度" 
              color="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600" 
              height="h-4"
            />
            <div className="text-xs text-pink-400 text-right mt-1 font-bold tracking-wide">
              {getSubmissionStage(target.submissionLevel)}
            </div>
          </div>

          <ProgressBar 
            value={target.affection} 
            max={100} 
            label="好感度" 
            color="bg-gradient-to-r from-rose-500 to-pink-500" 
            height="h-3"
          />
        </div>

        <div className="space-y-6">
           <div className="space-y-3">
              <div className="text-xs text-pink-500/70 font-bold uppercase tracking-widest flex items-center gap-2 border-b border-pink-500/10 pb-1">
                <Heart className="w-3 h-3" /> 性癖
              </div>
              <div className="flex flex-wrap gap-2">
                {target.fetishes.map(f => (
                  <span key={f} className="px-3 py-1 bg-pink-950/40 border border-pink-800/40 rounded text-xs text-pink-200 shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                    {f}
                  </span>
                ))}
              </div>
           </div>

           <div className="space-y-3">
              <div className="text-xs text-purple-500/70 font-bold uppercase tracking-widest flex items-center gap-2 border-b border-purple-500/10 pb-1">
                <Users className="w-3 h-3" /> 百合/情侣关系
              </div>
              <div className="text-sm text-gray-300 bg-white/5 p-3 rounded border border-white/5 italic">
                {target.partnerStatus}
              </div>
           </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
         <div>
            <div className="text-[10px] text-gray-500 uppercase mb-2 font-bold">临时状态</div>
            <div className="flex flex-wrap gap-2">
               {target.tempStatus.length > 0 ? target.tempStatus.map(s => (
                   <span key={s} className="px-2 py-0.5 bg-gray-800 text-gray-300 text-[10px] rounded border border-gray-700">{s}</span>
               )) : <span className="text-xs text-gray-600">无</span>}
            </div>
         </div>
         <div>
            <div className="text-[10px] text-emerald-500/70 uppercase mb-2 font-bold">永久状态</div>
            <div className="flex flex-wrap gap-2">
               {target.permStatus.length > 0 ? target.permStatus.map(s => (
                   <span key={s} className="px-2 py-0.5 bg-emerald-950/30 text-emerald-400 text-[10px] rounded border border-emerald-900/50 shadow-[0_0_5px_rgba(16,185,129,0.2)]">{s}</span>
               )) : <span className="text-xs text-gray-600">无</span>}
            </div>
         </div>
      </div>
    </GlassCard>
  );
};
