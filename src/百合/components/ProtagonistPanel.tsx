import type { ReactNode } from 'react';
import _ from 'lodash';
import { useState } from 'react';
import { Activity, Brain, Crosshair, Flame, Heart, Shield, Sparkles } from './icons';
import { TattooMotif } from './TattooMotif';
import { createFallbackAvatar, toDisplayNumber, toDisplayString, updateMessageVariables, useStatData } from '../statData';

type ProtagonistViewModel = {
  name: string;
  avatar: string;
  roleLabel: string;
  stats: {
    intelligence: number;
    charm: number;
    stamina: number;
    luck: number;
  };
  yuri: number;
  cognition: string;
  sensitivity: string;
  strategyPoints: number;
  route: string;
};

const FALLBACK_MODEL: ProtagonistViewModel = {
  name: '主控角色',
  avatar: createFallbackAvatar('主角', 'purple'),
  roleLabel: '变量待接入',
  stats: {
    intelligence: 0,
    charm: 0,
    stamina: 0,
    luck: 0,
  },
  yuri: 0,
  cognition: '暂无数据',
  sensitivity: '暂无数据',
  strategyPoints: 0,
  route: '暂无路线',
};

function buildSensitivityText(rawSensitivity: unknown): string {
  if (_.isString(rawSensitivity)) {
    return toDisplayString(rawSensitivity, FALLBACK_MODEL.sensitivity);
  }

  if (!_.isObject(rawSensitivity)) {
    return FALLBACK_MODEL.sensitivity;
  }

  const degree = toDisplayString(_.get(rawSensitivity, '当前程度'));
  const reaction = toDisplayString(_.get(rawSensitivity, '当前表现') ?? _.get(rawSensitivity, '表现') ?? _.get(rawSensitivity, '描述'));

  return [degree, reaction].filter(Boolean).join(' - ') || FALLBACK_MODEL.sensitivity;
}

function buildProtagonistModel(statData: Record<string, any>): ProtagonistViewModel {
  const panel = _.get(statData, '主控面板') ?? _.get(statData, '主角面板');
  if (!_.isObject(panel)) return FALLBACK_MODEL;

  const development = _.get(panel, '数值与养成');
  const coreStatus = _.get(panel, '核心状态');
  const sensitivity = _.get(panel, '身体敏感化');

  return {
    name: toDisplayString(_.get(panel, '姓名') ?? _.get(panel, '名字'), FALLBACK_MODEL.name),
    avatar: toDisplayString(
      _.get(panel, '头像') ?? _.get(panel, '立绘') ?? _.get(panel, '头像链接'),
      createFallbackAvatar(toDisplayString(_.get(panel, '姓名') ?? _.get(panel, '名字'), '主角').slice(0, 2), 'purple'),
    ),
    roleLabel: toDisplayString(_.get(panel, '身份') ?? _.get(panel, '标签') ?? _.get(panel, '角色定位'), '主控角色'),
    stats: {
      intelligence: _.clamp(toDisplayNumber(_.get(development, '智力') ?? _.get(development, '智慧'), 0), 0, 100),
      charm: _.clamp(toDisplayNumber(_.get(development, '魅力'), 0), 0, 100),
      stamina: _.clamp(toDisplayNumber(_.get(development, '体力'), 0), 0, 100),
      luck: _.clamp(toDisplayNumber(_.get(development, '幸运'), 0), 0, 100),
    },
    yuri: _.clamp(toDisplayNumber(_.get(coreStatus, '百合度') ?? _.get(coreStatus, '亲密度'), 0), -100, 100),
    cognition: toDisplayString(_.get(coreStatus, '直女认知阶段') ?? _.get(coreStatus, '认知阶段'), FALLBACK_MODEL.cognition),
    sensitivity: buildSensitivityText(sensitivity),
    strategyPoints: toDisplayNumber(_.get(development, '攻略点数') ?? _.get(panel, '攻略点数'), 0),
    route: toDisplayString(_.get(development, '当前攻略路线') ?? _.get(panel, '当前攻略路线'), FALLBACK_MODEL.route),
  };
}

export function ProtagonistContent() {
  const model = useStatData(buildProtagonistModel);
  const [pendingStat, setPendingStat] = useState<string | null>(null);

    const applyPoint = (statKey: 'intelligence' | 'charm' | 'stamina' | 'luck', amount: number) => {
      if (pendingStat || model.strategyPoints < amount) return;

    const statPathMap = {
      intelligence: ['智力', '智慧'],
      charm: ['魅力'],
      stamina: ['体力'],
      luck: ['幸运'],
    } as const;

    setPendingStat(statKey);

      const updated = updateMessageVariables(variables => {
        const statData = _.get(variables, 'stat_data');
        if (!_.isObject(statData)) return;

      const panelPath = _.has(statData, '主控面板') ? '主控面板' : '主角面板';
      const developmentPath = `${panelPath}.数值与养成`;
      const development = _.get(statData, developmentPath);
      if (!_.isObject(development)) return;

      const pointPath = _.has(development, '攻略点数') ? `${developmentPath}.攻略点数` : `${panelPath}.攻略点数`;
      const currentPoints = toDisplayNumber(_.get(statData, pointPath), 0);
      if (currentPoints < amount) return;

        const candidates = statPathMap[statKey];
        const existingKey = candidates.find(key => _.has(development, key)) ?? candidates[0];
        const fullStatPath = `${developmentPath}.${existingKey}`;
        const currentStat = toDisplayNumber(_.get(statData, fullStatPath), 0);
        const spendAmount = Math.min(amount, Math.max(0, 100 - currentStat));
        if (spendAmount <= 0 || currentPoints < spendAmount) return;

        _.set(statData, fullStatPath, Math.min(100, currentStat + spendAmount));
        _.set(statData, pointPath, Math.max(0, currentPoints - spendAmount));
      });

    if (!updated) {
      setPendingStat(null);
      return;
    }

    window.setTimeout(() => setPendingStat(null), 220);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4">
      <div className="bg-[#0a0005]/80 backdrop-blur-xl border border-pink-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-28 h-28 sm:w-40 sm:h-40 bg-purple-600/10 rounded-full blur-[40px]"></div>
        <div className="absolute -bottom-10 -right-10 w-36 h-36 sm:w-48 sm:h-48 text-purple-500/5 opacity-50 pointer-events-none">
          <TattooMotif />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 relative z-10">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
            <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.36),transparent_60%)] blur-xl opacity-100"></div>
            <div className="absolute inset-x-2 -top-2.5 h-3 rounded-full bg-white/16 blur-[3px]"></div>
            <div className="absolute right-0 top-0 h-3.5 w-3.5 rotate-12 opacity-80">
              <div className="absolute left-0 top-[1px] h-2 w-2 rounded-full bg-pink-100/55 blur-[0.5px]"></div>
              <div className="absolute right-0 top-[1px] h-2 w-2 rounded-full bg-pink-100/55 blur-[0.5px]"></div>
              <div className="absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-pink-100/45 blur-[0.5px]"></div>
            </div>
            <div className="absolute left-[-2px] bottom-3 h-2.5 w-2.5 rotate-[-18deg] opacity-60">
              <div className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white/50"></div>
              <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-white/50"></div>
              <div className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white/40"></div>
            </div>
            <div className="absolute left-1/2 top-[-9px] h-4 w-6 -translate-x-1/2">
              <div className="absolute left-0 top-1.5 h-2.5 w-3.5 -rotate-[28deg] rounded-full border border-pink-100/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(244,114,182,0.18))]"></div>
              <div className="absolute right-0 top-1.5 h-2.5 w-3.5 rotate-[28deg] rounded-full border border-pink-100/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(244,114,182,0.18))]"></div>
              <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-100/80 shadow-[0_0_8px_rgba(255,255,255,0.75)]"></div>
            </div>
            <div className="absolute right-[-4px] top-2 h-5 w-2.5 rounded-full border border-pink-100/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(244,114,182,0.08))] opacity-80"></div>
            <div className="absolute left-[-3px] bottom-2 h-4 w-2 rounded-full border border-pink-100/14 bg-white/8 opacity-70"></div>
            <div className="absolute -inset-1 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.3),rgba(251,113,133,0.95),rgba(244,114,182,0.84),rgba(217,70,239,0.62),rgba(255,255,255,0.26))] p-[1.5px] shadow-[0_0_24px_rgba(244,114,182,0.34)]">
              <div className="relative h-full w-full rounded-full bg-[linear-gradient(180deg,rgba(31,5,19,0.96),rgba(11,1,8,0.96))] p-[3px]">
                <div className="absolute inset-[2px] rounded-full border border-white/18"></div>
                <div className="absolute inset-[6px] rounded-full border border-pink-100/12"></div>
                <div className="absolute inset-x-2 top-1.5 h-2.5 rounded-full bg-white/20 blur-[2px]"></div>
                <div className="absolute right-1 top-2.5 h-1.5 w-4 rounded-full bg-white/14 blur-[1px]"></div>
                <div className="absolute -bottom-1 right-2 h-2 w-5 rounded-full border border-fuchsia-200/18 bg-[linear-gradient(90deg,rgba(244,114,182,0.26),rgba(255,255,255,0.06))] opacity-80"></div>
                <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-pink-100/75 shadow-[0_0_8px_rgba(255,255,255,0.75)]"></div>
                <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center overflow-hidden ring-1 ring-white/10">
                  <img src={model.avatar} alt={model.name} className="w-full h-full object-cover opacity-95" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">{model.name}</h2>
            <div className="text-xs text-purple-400 tracking-widest mt-1 flex items-center gap-1">
              <Shield size={12} />
              <span>{model.roleLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-5 gap-y-3 sm:gap-y-4 relative z-10 mb-5 sm:mb-6 bg-black/40 p-3 sm:p-4 rounded-xl border border-pink-500/10 shadow-inner">
          <StatBar
            icon={<Brain size={14} />}
            label="智力"
            value={model.stats.intelligence}
            color="bg-blue-500"
            textColor="text-blue-400"
            canSpend={model.strategyPoints > 0 && model.stats.intelligence < 100}
            pending={pendingStat === 'intelligence'}
            onAddOne={() => applyPoint('intelligence', 1)}
            onAddFive={() => applyPoint('intelligence', 5)}
            availablePoints={model.strategyPoints}
          />
          <StatBar
            icon={<Sparkles size={14} />}
            label="魅力"
            value={model.stats.charm}
            color="bg-yellow-500"
            textColor="text-yellow-400"
            canSpend={model.strategyPoints > 0 && model.stats.charm < 100}
            pending={pendingStat === 'charm'}
            onAddOne={() => applyPoint('charm', 1)}
            onAddFive={() => applyPoint('charm', 5)}
            availablePoints={model.strategyPoints}
          />
          <StatBar
            icon={<Activity size={14} />}
            label="体力"
            value={model.stats.stamina}
            color="bg-green-500"
            textColor="text-green-400"
            canSpend={model.strategyPoints > 0 && model.stats.stamina < 100}
            pending={pendingStat === 'stamina'}
            onAddOne={() => applyPoint('stamina', 1)}
            onAddFive={() => applyPoint('stamina', 5)}
            availablePoints={model.strategyPoints}
          />
          <StatBar
            icon={<Flame size={14} />}
            label="幸运"
            value={model.stats.luck}
            color="bg-orange-500"
            textColor="text-orange-400"
            canSpend={model.strategyPoints > 0 && model.stats.luck < 100}
            pending={pendingStat === 'luck'}
            onAddOne={() => applyPoint('luck', 1)}
            onAddFive={() => applyPoint('luck', 5)}
            availablePoints={model.strategyPoints}
          />
        </div>

        <div className="space-y-3 sm:space-y-4 relative z-10">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-pink-300 flex items-center gap-1 font-bold"><Heart size={12} className="text-pink-500" /> 百合度</span>
              <span className="text-pink-400 font-mono font-bold">{model.yuri}/100</span>
            </div>
            <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-pink-600 to-purple-500 relative shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                style={{ width: `${Math.max(0, Math.min(100, Math.abs(model.yuri)))}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-2.5 sm:p-3 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <div className="text-xs text-purple-400/80 mb-1">直女认知阶段</div>
            <div className="text-sm text-purple-200 font-bold">{model.cognition}</div>
          </div>

          <div className="bg-pink-950/40 border border-pink-500/30 rounded-lg p-2.5 sm:p-3 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
            <div className="text-xs text-pink-400/80 mb-1">身体敏感化</div>
            <div className="text-sm text-pink-200 font-bold">{model.sensitivity}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#0a0005]/80 backdrop-blur-xl border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)] shrink-0 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-36 h-36 sm:w-48 sm:h-48 text-purple-500/5 opacity-50 pointer-events-none rotate-180">
          <TattooMotif />
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-gray-200 mb-3 sm:mb-4 flex items-center gap-2 relative z-10">
          <Crosshair size={16} className="text-purple-400" />
          攻略情报
        </h3>

        <div className="space-y-3 sm:space-y-4 relative z-10">
          <div className="flex items-center justify-between p-2.5 sm:p-3 bg-black/40 rounded-xl border border-purple-500/20 shadow-inner">
            <div>
              <span className="text-sm text-purple-300/80">攻略点数</span>
              <div className="text-[10px] text-purple-300/45 mt-1">可用于提升四维，1 点换 1 属性</div>
            </div>
            <span className="text-lg font-mono text-purple-300 font-bold drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
              {model.strategyPoints.toLocaleString('zh-CN')}
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-black/40 rounded-xl border border-pink-500/20 shadow-inner">
            <span className="text-xs text-pink-300/80 block mb-2">当前攻略路线</span>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-pink-300 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
              <Flame size={14} className="animate-pulse" />
              {model.route}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({
  icon,
  label,
  value,
  color,
  textColor,
  canSpend,
  pending,
  onAddOne,
  onAddFive,
  availablePoints,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
  textColor: string;
  canSpend: boolean;
  pending: boolean;
  onAddOne: () => void;
  onAddFive: () => void;
  availablePoints: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex justify-between items-center text-[11px] sm:text-xs ${textColor}`}>
        <span className="flex items-center gap-1 font-bold">{icon} {label}</span>
        <span className="font-mono font-bold">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color} shadow-[0_0_10px_currentColor]`} style={{ width: `${value}%` }}></div>
      </div>
      <div className="flex gap-1.5 pt-1">
        <PointButton onClick={onAddOne} disabled={!canSpend || availablePoints < 1 || pending}>+1</PointButton>
        <PointButton onClick={onAddFive} disabled={!canSpend || availablePoints < 5 || pending}>+5</PointButton>
      </div>
    </div>
  );
}

function PointButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold transition-all ${
        disabled
          ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
          : 'border-pink-400/35 bg-pink-500/10 text-pink-200 hover:border-pink-300/60 hover:bg-pink-500/18 hover:shadow-[0_0_12px_rgba(244,114,182,0.2)]'
      }`}
    >
      {children}
    </button>
  );
}
