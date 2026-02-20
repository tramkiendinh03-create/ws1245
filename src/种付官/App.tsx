/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TargetProfileCard } from './components/TargetProfileCard';
import { PlayerPanel } from './components/PlayerPanel';
import { InventoryApp } from './components/InventoryApp';
import { AppIcon } from './components/AppIcon';
import { AppWindow } from './components/AppWindow';
import { StatusBar } from './components/StatusBar';
import { GameState } from './types';
import { 
  User, Database, Map, Settings, Shield, Palette, Package, Plus, Trash2
} from 'lucide-react';
import { GlassCard } from './components/ui';

// Mock Initial Data
const INITIAL_STATE: GameState = {
  time: "22:45",
  location: "学园都市 - 中央广场 (狩猎区)",
  atmosphere: "霓虹灯光在湿润的地面反射出暧昧的光晕，远处的警笛声若隐若现，空气中弥漫着廉价香水与臭氧混合的味道。",
  targets: [
    {
      name: "早川 玲子",
      occupation: "风纪委员长 / 优等生",
      difficulty: "A",
      relationship: "猎物 / 陌生人",
      surfaceEmotion: "警惕",
      resistanceIndex: 85,
      submissionLevel: 12,
      affection: 5,
      fetishes: ["制服凌辱", "公众露出(潜意识)"],
      partnerStatus: "有未婚夫 (政治联姻，无感情)",
      tempStatus: ["巡逻中", "轻微疲劳"],
      permStatus: ["高岭之花", "敏感体质"],
      isPregnant: false,
      avatarUrl: "https://picsum.photos/seed/reiko/400/400"
    },
    {
      name: "星野 奈奈",
      occupation: "地下偶像 / 兼职女仆",
      difficulty: "C",
      relationship: "粉丝 / 跟踪对象",
      surfaceEmotion: "营业式微笑",
      resistanceIndex: 40,
      submissionLevel: 45,
      affection: 60,
      fetishes: ["被支配", "镜面羞耻"],
      partnerStatus: "单身 (禁止恋爱条例)",
      tempStatus: ["演出后", "兴奋"],
      permStatus: ["受虐体质", "声控"],
      isPregnant: true,
      avatarUrl: "https://picsum.photos/seed/nana/400/400"
    }
  ],
  player: {
    name: "Phantom",
    identity: "隐形人",
    gender: "男",
    level: "B",
    xp: 340,
    maxXp: 500,
    currentTask: "搜寻高资质目标",
    points: 1250,
    items: ["强效媚药", "震动控制环", "全息伪装器"],
    tempBuffs: ["气息遮断 (20m)"],
    permTraits: ["无限精力", "催眠眼 (Lv.1)"]
  },
  narrative: [] // Removed usage
};

const THEME_COLORS = [
  { name: "霓虹紫", value: "text-purple-400", border: "border-purple-500/50", bg: "bg-purple-500" },
  { name: "赛博蓝", value: "text-cyan-400", border: "border-cyan-500/50", bg: "bg-cyan-500" },
  { name: "赤红", value: "text-red-400", border: "border-red-500/50", bg: "bg-red-500" },
  { name: "翡翠", value: "text-emerald-400", border: "border-emerald-500/50", bg: "bg-emerald-500" },
  { name: "琥珀", value: "text-amber-400", border: "border-amber-500/50", bg: "bg-amber-500" },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number | null>(null);
  const [themeColor, setThemeColor] = useState(THEME_COLORS[0]);

  const handleRemoveTarget = (index: number) => {
    setGameState(prev => ({
      ...prev,
      targets: prev.targets.filter((_, i) => i !== index)
    }));
    if (selectedTargetIndex === index) {
      setSelectedTargetIndex(null);
    }
  };

  const handleRemoveItem = (index: number) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        items: prev.player.items.filter((_, i) => i !== index)
      }
    }));
  };

  // Helper to render target list or detail
  const renderTargetContent = () => {
    if (selectedTargetIndex !== null) {
      const target = gameState.targets[selectedTargetIndex];
      // Handle case where target might have been deleted while selected
      if (!target) return null; 

      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => setSelectedTargetIndex(null)}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 transition-colors"
            >
              ← 返回列表
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
             <TargetProfileCard target={target} />
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gameState.targets.map((target, index) => (
            <div
              key={index}
              className="relative group bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-500/30 transition-all"
            >
              <button
                onClick={() => setSelectedTargetIndex(index)}
                className="flex items-center gap-4 p-4 w-full text-left"
              >
                <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden shrink-0 border border-white/10 group-hover:border-purple-500/50">
                  <img src={target.avatarUrl} alt={target.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">{target.name}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-gray-300">攻略难度: {target.difficulty}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{target.occupation}</div>
                  <div className="text-xs text-gray-500 mt-2 flex gap-2">
                    <span>臣服: {target.submissionLevel}%</span>
                    <span>反抗: {target.resistanceIndex}%</span>
                  </div>
                </div>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTarget(index);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all z-10"
                title="删除档案"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      {/* Tablet Device Frame */}
      <div className="relative w-full max-w-[1200px] aspect-[16/10] bg-black rounded-[3rem] shadow-2xl border-[12px] border-gray-900 ring-1 ring-white/10 overflow-hidden flex flex-col">
        
        {/* Screen Content */}
        <div className="flex-1 relative bg-zinc-950 overflow-hidden flex flex-col">
          {/* Wallpaper / Background */}
          <div className="absolute inset-0 z-0">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-700 ease-in-out"
              style={{ backgroundImage: `url(https://picsum.photos/seed/cyberpunk/1920/1080?blur=8)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
          </div>

          {/* Status Bar */}
          <div className="relative z-20 bg-black/10 backdrop-blur-md border-b border-white/5">
            <StatusBar time={gameState.time} />
          </div>

          {/* Desktop Area */}
          <div className="relative z-10 flex-1 p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Widgets */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
              {/* SpaceTime Widget */}
              <GlassCard className="p-6 flex flex-col justify-between min-h-[180px] bg-black/40 border-white/10 backdrop-blur-xl">
                <div>
                  <div className={`flex items-center gap-2 mb-2 ${themeColor.value}`}>
                    <Map className="w-4 h-4" />
                    <span className="text-xs font-bold tracking-widest uppercase">地点</span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-white leading-tight mb-1">
                    {gameState.location.split('-')[0]}
                  </h2>
                  <div className="text-lg text-gray-300">
                    {gameState.location.split('-')[1]}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-1">环境氛围</div>
                  <div className="text-sm text-gray-200 italic line-clamp-2">
                    "{gameState.atmosphere}"
                  </div>
                </div>
              </GlassCard>

              {/* Player Mini Widget */}
              <GlassCard className={`p-4 bg-black/40 border-white/10 backdrop-blur-xl group hover:${themeColor.border} transition-colors duration-300`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold ${themeColor.value}`}>身份标识</span>
                  <span className="text-xs font-mono text-gray-400">当前等级 {gameState.player.level}</span>
                </div>
                <div className="font-display font-bold text-white text-lg">{gameState.player.name}</div>
                <div className="text-xs text-gray-400 mt-1">{gameState.player.currentTask}</div>
              </GlassCard>
            </div>

            {/* Right: App Grid */}
            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-4 gap-x-8 gap-y-10 content-start pt-4">
              <AppIcon 
                id="target" 
                label="目标档案" 
                icon={User} 
                color="text-pink-400" 
                onClick={() => setOpenApp('target')} 
              />
              <AppIcon 
                id="player" 
                label="种付官" 
                icon={Shield} 
                color="text-blue-400" 
                onClick={() => setOpenApp('player')} 
              />
              <AppIcon 
                id="inventory" 
                label="道具箱" 
                icon={Package} 
                color="text-amber-400" 
                onClick={() => setOpenApp('inventory')} 
              />
              <AppIcon 
                id="database" 
                label="数据库" 
                icon={Database} 
                color="text-purple-400" 
                onClick={() => setOpenApp('database')} 
              />
              <AppIcon 
                id="settings" 
                label="系统设置" 
                icon={Settings} 
                color="text-gray-400" 
                onClick={() => setOpenApp('settings')} 
              />
            </div>
          </div>

          {/* Dock (Bottom Bar) */}
          <div className="relative z-20 mx-auto mb-6 p-3 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/10 flex gap-6 shadow-2xl">
             <AppIcon 
                id="target_dock" 
                label="" 
                icon={User} 
                color="text-pink-400" 
                onClick={() => setOpenApp('target')} 
              />
             <AppIcon 
                id="player_dock" 
                label="" 
                icon={Shield} 
                color="text-blue-400" 
                onClick={() => setOpenApp('player')} 
              />
             <AppIcon 
                id="inventory_dock" 
                label="" 
                icon={Package} 
                color="text-amber-400" 
                onClick={() => setOpenApp('inventory')} 
              />
             <AppIcon 
                id="settings_dock" 
                label="" 
                icon={Settings} 
                color="text-gray-400" 
                onClick={() => setOpenApp('settings')} 
              />
          </div>

          {/* Windows / Modals */}
          <AppWindow 
            isOpen={openApp === 'target'} 
            onClose={() => { setOpenApp(null); setSelectedTargetIndex(null); }} 
            title="目标档案"
            className="bg-black/80"
          >
            {renderTargetContent()}
          </AppWindow>

          <AppWindow 
            isOpen={openApp === 'player'} 
            onClose={() => setOpenApp(null)} 
            title="种付官面板"
          >
            <PlayerPanel player={gameState.player} />
          </AppWindow>

          <AppWindow 
            isOpen={openApp === 'inventory'} 
            onClose={() => setOpenApp(null)} 
            title="道具箱"
          >
            <InventoryApp 
              items={gameState.player.items} 
              onRemoveItem={handleRemoveItem}
            />
          </AppWindow>

          <AppWindow 
            isOpen={openApp === 'settings'} 
            onClose={() => setOpenApp(null)} 
            title="系统设置"
          >
            <div className="p-4 space-y-8">
              {/* Theme Color Section */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-gray-300">
                  <Palette className="w-5 h-5" />
                  <h3 className="font-bold">界面主题色</h3>
                </div>
                <div className="flex gap-4">
                  {THEME_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setThemeColor(color)}
                      className={`w-12 h-12 rounded-full ${color.bg} border-2 transition-transform hover:scale-110 ${
                        themeColor.name === color.name ? 'border-white ring-2 ring-white/20' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </section>
            </div>
          </AppWindow>

          <AppWindow 
            isOpen={openApp === 'database'} 
            onClose={() => setOpenApp(null)} 
            title="数据库"
          >
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <div className="text-lg font-display font-bold">模块开发中</div>
              <div className="text-sm">数据库功能即将上线...</div>
            </div>
          </AppWindow>

        </div>
        
        {/* Home Bar Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-30" />
      </div>
    </div>
  );
}
