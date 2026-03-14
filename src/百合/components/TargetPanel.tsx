import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { Droplets, Eye, Heart, Lock, Sparkles } from './icons';
import { TattooMotif } from './TattooMotif';
import { LilyMotif } from './LilyMotif';
import { createFallbackAvatar, toDisplayNumber, toDisplayString, useStatData } from '../statData';

type TargetTheme = {
  avatarBg: string;
  avatarShadow: string;
  panelBorder: string;
  panelShadow: string;
  bgGradient: string;
  textAccent: string;
  motifColor: string;
};

type TargetViewModel = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  status: Array<{ label: string; classes: string }>;
  stats: { favorability: number; yuri: number; dominance: number };
  appearance: string;
  theme: TargetTheme;
};

const THEMES: TargetTheme[] = [
  {
    avatarBg: 'from-pink-500 to-rose-600',
    avatarShadow: 'shadow-[0_0_25px_rgba(236,72,153,0.5)]',
    panelBorder: 'border-pink-500/30',
    panelShadow: 'shadow-[0_0_30px_rgba(236,72,153,0.15)]',
    bgGradient: 'from-pink-900/30',
    textAccent: 'text-pink-400',
    motifColor: 'text-pink-500/10',
  },
  {
    avatarBg: 'from-blue-500 to-purple-600',
    avatarShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    panelBorder: 'border-purple-500/30',
    panelShadow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
    bgGradient: 'from-purple-900/30',
    textAccent: 'text-purple-400',
    motifColor: 'text-purple-500/10',
  },
  {
    avatarBg: 'from-fuchsia-500 to-pink-600',
    avatarShadow: 'shadow-[0_0_25px_rgba(217,70,239,0.45)]',
    panelBorder: 'border-fuchsia-500/30',
    panelShadow: 'shadow-[0_0_30px_rgba(217,70,239,0.14)]',
    bgGradient: 'from-fuchsia-900/30',
    textAccent: 'text-fuchsia-400',
    motifColor: 'text-fuchsia-500/10',
  },
];

const STATUS_CLASS_ROTATION = [
  'bg-red-950/40 border-red-500/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
  'bg-pink-950/40 border-pink-500/50 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]',
  'bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  'bg-blue-950/40 border-blue-500/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
];

const FALLBACK_TARGETS: TargetViewModel[] = [
  {
    id: 'fallback-target',
    name: '攻略目标',
    title: '等待变量',
    avatar: createFallbackAvatar('目标'),
    status: [{ label: '未初始化', classes: STATUS_CLASS_ROTATION[1] }],
    stats: { favorability: 0, yuri: 0, dominance: 0 },
    appearance: '等待消息楼层变量中的攻略栏目数据。',
    theme: THEMES[0],
  },
];

function normalizeStatusList(rawStatus: unknown): Array<{ label: string; classes: string }> {
  let labels: string[] = [];

  if (_.isString(rawStatus)) {
    labels = rawStatus.split(/[、，,／/]/).map(item => item.trim()).filter(Boolean);
  } else if (_.isArray(rawStatus)) {
    labels = rawStatus.map(item => toDisplayString(item)).filter(Boolean);
  } else if (_.isObject(rawStatus)) {
    labels = Object.values(rawStatus as Record<string, unknown>).map(item => toDisplayString(item)).filter(Boolean);
  }

  if (labels.length === 0) labels = ['状态未知'];

  return labels.slice(0, 3).map((label, index) => ({
    label,
    classes: STATUS_CLASS_ROTATION[index % STATUS_CLASS_ROTATION.length],
  }));
}

function buildTargets(statData: Record<string, any>): TargetViewModel[] {
  const rawTargets = _.get(statData, '攻略栏目');
  if (!_.isObject(rawTargets)) return FALLBACK_TARGETS;

  const entries = Object.entries(rawTargets as Record<string, unknown>);
  if (entries.length === 0) return FALLBACK_TARGETS;

  return entries.map(([name, raw], index) => {
    const data = _.isObject(raw) ? (raw as Record<string, unknown>) : {};
    const theme = THEMES[index % THEMES.length];

    return {
      id: `target-${index}`,
      name,
      title: toDisplayString(_.get(data, '身份') ?? _.get(data, '称号') ?? _.get(data, '职位'), '攻略对象'),
      avatar: toDisplayString(
        _.get(data, '头像') ?? _.get(data, '立绘') ?? _.get(data, '头像链接'),
        createFallbackAvatar(name.slice(0, 2)),
      ),
      status: normalizeStatusList(_.get(data, '当前状态.临时状态') ?? _.get(data, '当前状态') ?? _.get(data, '状态')),
      stats: {
        favorability: _.clamp(toDisplayNumber(_.get(data, '数值面板.好感度'), 0), -100, 100),
        yuri: _.clamp(toDisplayNumber(_.get(data, '数值面板.百合度'), 0), -100, 100),
        dominance: _.clamp(toDisplayNumber(_.get(data, '数值面板.支配度'), 0), -100, 100),
      },
      appearance: toDisplayString(_.get(data, '外观状态描写') ?? _.get(data, '外观描写') ?? _.get(data, '描述'), '暂无外观状态描写。'),
      theme,
    };
  });
}

export function TargetContent() {
  const targets = useStatData(buildTargets);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= targets.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, targets.length]);

  const target = targets[currentIndex] ?? FALLBACK_TARGETS[0];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 pr-1 pb-3 sm:pb-4">
      <div className="flex gap-4 sm:gap-6 justify-center py-1 relative shrink-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>

        {targets.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => setCurrentIndex(idx)}
            className={`group relative w-11 h-11 sm:w-14 sm:h-14 rounded-full transition-all duration-500 z-10 ${
              currentIndex === idx
                ? `scale-110 opacity-100`
                : 'opacity-55 hover:opacity-85 scale-90 hover:scale-100'
            }`}
          >
            <div className={`absolute -inset-4 rounded-full bg-gradient-to-br ${t.theme.avatarBg} blur-xl transition-opacity duration-500 ${currentIndex === idx ? 'opacity-42' : 'opacity-0 group-hover:opacity-22'}`}></div>
            <div className="absolute inset-x-1.5 -top-1.5 h-2 rounded-full bg-white/14 blur-[2px]"></div>
            <div className={`absolute right-0 top-0 h-2.5 w-2.5 rotate-12 transition-opacity duration-500 ${currentIndex === idx ? 'opacity-80' : 'opacity-0 group-hover:opacity-55'}`}>
              <div className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-pink-100/55"></div>
              <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-pink-100/55"></div>
              <div className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-pink-100/45"></div>
            </div>
            <div className="absolute left-1/2 top-[-6px] h-3 w-5 -translate-x-1/2">
              <div className="absolute left-0 top-1 h-2 w-3 -rotate-[28deg] rounded-full border border-pink-100/28 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(244,114,182,0.14))]"></div>
              <div className="absolute right-0 top-1 h-2 w-3 rotate-[28deg] rounded-full border border-pink-100/28 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(244,114,182,0.14))]"></div>
              <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-100/75"></div>
            </div>
            <div className={`absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.22),rgba(251,113,133,0.92),rgba(244,114,182,0.8),rgba(217,70,239,0.62),rgba(255,255,255,0.18))] p-[1.5px] ${currentIndex === idx ? t.theme.avatarShadow : ''}`}>
              <div className="relative h-full w-full rounded-full bg-[linear-gradient(180deg,rgba(29,4,17,0.96),rgba(10,1,8,0.95))] p-[2px]">
                <div className="absolute inset-[2px] rounded-full border border-white/16"></div>
                <div className="absolute inset-[5px] rounded-full border border-pink-100/10"></div>
                <div className="absolute inset-x-2 top-1 h-2 rounded-full bg-white/16 blur-[2px]"></div>
                <div className="absolute right-1 top-2 h-1 w-3 rounded-full bg-white/12"></div>
                <div className="absolute -bottom-1 right-2 h-1.5 w-3.5 rounded-full bg-pink-200/16"></div>
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0005] ring-1 ring-white/8">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className={`bg-[#0a0005]/80 backdrop-blur-2xl border border-white/5 ${target.theme.panelBorder} rounded-xl sm:rounded-2xl p-4 sm:p-6 ${target.theme.panelShadow} relative overflow-hidden transition-all duration-700 group flex flex-col shrink-0`}>
        <div className={`absolute top-0 left-0 w-full h-36 sm:h-48 bg-gradient-to-b ${target.theme.bgGradient} to-transparent transition-colors duration-700 opacity-60 pointer-events-none`}></div>
        <div className={`absolute -top-20 -right-20 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br ${target.theme.avatarBg} rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`}></div>

        <div className={`absolute top-20 -left-16 w-48 h-48 sm:w-64 sm:h-64 ${target.theme.motifColor} opacity-40 pointer-events-none rotate-[-15deg] transition-colors duration-700`}>
          <LilyMotif />
        </div>
        <div className={`absolute bottom-0 -right-10 w-44 h-44 sm:w-56 sm:h-56 ${target.theme.motifColor} opacity-30 pointer-events-none rotate-[15deg] transition-colors duration-700`}>
          <TattooMotif />
        </div>

        <div className="flex flex-col items-center mb-6 sm:mb-8 relative z-10">
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 mb-3 sm:mb-4">
            <div className={`absolute -inset-6 rounded-full bg-gradient-to-br ${target.theme.avatarBg} blur-2xl opacity-38`}></div>
            <div className="absolute inset-x-4 -top-3 h-4 rounded-full bg-white/16 blur-[4px]"></div>
            <div className="absolute right-1 top-1 h-5 w-5 rotate-12 opacity-80">
              <div className="absolute left-0 top-0.5 h-3 w-3 rounded-full bg-pink-100/52 blur-[0.5px]"></div>
              <div className="absolute right-0 top-0.5 h-3 w-3 rounded-full bg-pink-100/52 blur-[0.5px]"></div>
              <div className="absolute left-1/2 top-2.5 h-3.5 w-3.5 -translate-x-1/2 rotate-45 bg-pink-100/4 blur-[0.5px]"></div>
            </div>
            <div className="absolute left-1 bottom-5 h-3.5 w-3.5 rotate-[-20deg] opacity-55">
              <div className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white/48"></div>
              <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-white/48"></div>
              <div className="absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rotate-45 bg-white/38"></div>
            </div>
            <div className="absolute left-1/2 top-[-12px] h-5 w-8 -translate-x-1/2">
              <div className="absolute left-0 top-2 h-3 w-4 -rotate-[30deg] rounded-full border border-pink-100/32 bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(244,114,182,0.16))]"></div>
              <div className="absolute right-0 top-2 h-3 w-4 rotate-[30deg] rounded-full border border-pink-100/32 bg-[linear-gradient(180deg,rgba(255,255,255,0.26),rgba(244,114,182,0.16))]"></div>
              <div className="absolute left-1/2 top-2.5 h-2 w-2 -translate-x-1/2 rounded-full bg-pink-100/80 shadow-[0_0_10px_rgba(255,255,255,0.7)]"></div>
            </div>
            <div className="absolute right-[-5px] top-4 h-7 w-3 rounded-full border border-pink-100/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(244,114,182,0.08))] opacity-80"></div>
            <div className="absolute left-[-4px] bottom-4 h-5 w-2.5 rounded-full border border-pink-100/12 bg-white/8 opacity-70"></div>
            <div className="absolute -inset-[10px] rounded-full border border-pink-100/8"></div>
            <div className="absolute inset-[-2px] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.26),rgba(251,113,133,0.96),rgba(244,114,182,0.84),rgba(217,70,239,0.64),rgba(255,255,255,0.22))] p-[2px] shadow-[0_0_30px_rgba(244,114,182,0.26)]">
              <div className="relative h-full w-full rounded-full bg-[linear-gradient(180deg,rgba(28,3,17,0.97),rgba(9,1,7,0.95))] p-[4px]">
                <div className="absolute inset-[3px] rounded-full border border-white/18"></div>
                <div className="absolute inset-[8px] rounded-full border border-pink-100/10"></div>
                <div className="absolute inset-x-4 top-2.5 h-3.5 rounded-full bg-white/20 blur-[3px]"></div>
                <div className="absolute right-2 top-4 h-1.5 w-6 rounded-full bg-white/10 blur-[1px]"></div>
                <div className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-white/72 shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                <div className="absolute -bottom-1 right-3 h-2.5 w-6 rounded-full border border-fuchsia-100/16 bg-[linear-gradient(90deg,rgba(244,114,182,0.24),rgba(255,255,255,0.06))] opacity-80"></div>
                <div className="w-full h-full rounded-full bg-[#0a0005] p-1.5 ring-1 ring-white/10">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src={target.avatar} alt={target.name} className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-all duration-700 hover:scale-110" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 tracking-wide sm:tracking-widest drop-shadow-lg">{target.name}</h2>
          <div className={`text-[11px] sm:text-xs ${target.theme.textAccent} tracking-[0.18em] sm:tracking-[0.3em] mt-1.5 sm:mt-2 uppercase font-bold opacity-90 flex items-center gap-1`}>
            <Sparkles size={10} />
            {target.title}
            <Sparkles size={10} />
          </div>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 relative z-10 flex-wrap">
          {target.status.map((s, i) => (
            <span key={`${s.label}-${i}`} className={`px-3 sm:px-4 py-1 rounded-full border text-[11px] sm:text-xs font-bold tracking-wide sm:tracking-widest backdrop-blur-md ${s.classes}`}>
              {s.label}
            </span>
          ))}
        </div>

        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 relative z-10">
          <ProgressBar icon={<Heart size={14} />} label="好感度" value={target.stats.favorability} color="bg-gradient-to-r from-pink-600 to-rose-400" glowColor="rgba(236,72,153,0.6)" />
          <ProgressBar icon={<Droplets size={14} />} label="百合度" value={target.stats.yuri} color="bg-gradient-to-r from-purple-600 to-fuchsia-400" glowColor="rgba(168,85,247,0.6)" />
          <ProgressBar icon={<Lock size={14} />} label="支配度" value={target.stats.dominance} color="bg-gradient-to-r from-red-700 to-red-400" glowColor="rgba(239,68,68,0.6)" />
        </div>

        <div className="mt-auto relative z-10">
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b ${target.theme.avatarBg} opacity-80`}></div>
          <div className="bg-gradient-to-r from-white/[0.03] to-transparent rounded-r-xl sm:rounded-r-2xl p-4 sm:p-5 pl-5 sm:pl-6 border-y border-r border-white/5 relative group-hover:bg-white/[0.06] transition-colors duration-500 backdrop-blur-sm">
            <div className={`flex items-center gap-2 text-xs ${target.theme.textAccent} font-bold mb-3 tracking-widest uppercase`}>
              <Eye size={14} className="opacity-80" />
              <span>外观观测</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300/90 leading-6 sm:leading-loose font-serif italic tracking-wide">{target.appearance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  icon,
  label,
  value,
  color,
  glowColor,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
  glowColor: string;
}) {
  const displayValue = _.clamp(value, -100, 100);
  const width = `${Math.max(0, Math.min(100, Math.abs(displayValue)))}%`;

  return (
    <div className="group">
      <div className="flex justify-between text-[11px] sm:text-xs mb-1.5 sm:mb-2">
        <span className="text-gray-300 flex items-center gap-1.5 sm:gap-2 font-bold tracking-wide sm:tracking-widest uppercase">{icon} {label}</span>
        <span className="text-gray-100 font-mono font-bold tracking-wider drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{displayValue}<span className="text-gray-500 text-[10px]">/100</span></span>
      </div>
      <div className="h-1.5 sm:h-2 w-full bg-[#050002] rounded-full overflow-hidden border border-white/5 shadow-inner relative">
        <div className={`absolute top-0 left-0 h-full ${color} transition-all duration-1000 ease-out`} style={{ width, boxShadow: `0 0 15px ${glowColor}` }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMTBMMTAgMFoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjIpIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=')] opacity-30"></div>
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/60 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
