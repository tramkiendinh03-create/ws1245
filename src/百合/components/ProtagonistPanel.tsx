import type { ReactNode } from 'react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Activity, Brain, Crosshair, Flame, Heart, Shield, Sparkles } from './icons';
import { TattooMotif } from './TattooMotif';
import { resolveProtagonistBaiheImageUrl, toDisplayNumber, toDisplayString, updateMessageVariables, useStatData } from '../statData';

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
  freeAttributePoints: number;
  strategyPoints: number;
  route: string;
};

const FALLBACK_MODEL: ProtagonistViewModel = {
  name: '主控角色',
  avatar: '',
  roleLabel: '变量待接入',
  stats: { intelligence: 0, charm: 0, stamina: 0, luck: 0 },
  yuri: 0,
  cognition: '暂无数据',
  sensitivity: '暂无数据',
  freeAttributePoints: 0,
  strategyPoints: 0,
  route: '暂无路线',
};

function buildSensitivityText(rawSensitivity: unknown): string {
  if (_.isString(rawSensitivity)) return toDisplayString(rawSensitivity, FALLBACK_MODEL.sensitivity);
  if (!_.isObject(rawSensitivity)) return FALLBACK_MODEL.sensitivity;

  const degree = toDisplayString(_.get(rawSensitivity, '当前程度'), '');
  const reaction = toDisplayString(_.get(rawSensitivity, '当前表现') ?? _.get(rawSensitivity, '表现') ?? _.get(rawSensitivity, '描述'), '');
  return [degree, reaction].filter(Boolean).join(' - ') || FALLBACK_MODEL.sensitivity;
}

function buildProtagonistModel(statData: Record<string, any>): ProtagonistViewModel {
  const panel = _.get(statData, '主控面板') ?? _.get(statData, '主角面板');
  if (!_.isObject(panel)) return FALLBACK_MODEL;

  const development = _.get(panel, '数值与养成');
  const coreStatus = _.get(panel, '核心状态');
  const sensitivity = _.get(panel, '身体敏感变化');

  return {
    name: toDisplayString(_.get(panel, '姓名') ?? _.get(panel, '名字'), FALLBACK_MODEL.name),
    avatar: resolveProtagonistBaiheImageUrl(_.get(coreStatus, '百合度') ?? _.get(coreStatus, '亲密度')),
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
    freeAttributePoints: toDisplayNumber(_.get(development, '自由属性点') ?? _.get(panel, '自由属性点') ?? _.get(statData, '自由属性点'), 0),
    strategyPoints: toDisplayNumber(_.get(development, '攻略点数') ?? _.get(panel, '攻略点数'), 0),
    route: toDisplayString(_.get(development, '当前攻略路线') ?? _.get(panel, '当前攻略路线'), FALLBACK_MODEL.route),
  };
}

function AvatarImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [hidden, setHidden] = useState(!src);

  useEffect(() => {
    setHidden(!src);
  }, [src]);

  if (hidden) return null;
  return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" onError={() => setHidden(true)} />;
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" onClick={onClose}>
      <button
        type="button"
        onClick={event => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-sm font-bold text-white/80 transition hover:border-pink-300/40 hover:text-pink-100"
      >
        ×
      </button>
      <div className="relative max-h-[90vh] max-w-[min(92vw,720px)] overflow-hidden rounded-3xl border border-pink-300/20 bg-[#12010a] shadow-[0_0_50px_rgba(244,114,182,0.24)]" onClick={event => event.stopPropagation()}>
        <img src={src} alt={alt} className="block max-h-[90vh] w-auto max-w-full object-contain" referrerPolicy="no-referrer" />
      </div>
    </div>
  );
}

export function ProtagonistContent() {
  const model = useStatData(buildProtagonistModel);
  const [pendingStat, setPendingStat] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; alt: string } | null>(null);

  const applyPoint = (statKey: 'intelligence' | 'charm' | 'stamina' | 'luck', amount: number) => {
    if (pendingStat || model.freeAttributePoints < amount) return;

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

      const pointPath = _.has(development, '自由属性点')
        ? `${developmentPath}.自由属性点`
        : _.has(statData, `${panelPath}.自由属性点`)
          ? `${panelPath}.自由属性点`
          : '自由属性点';
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
    <>
      <div className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4">
        <div className="bg-[#0a0005]/80 backdrop-blur-xl border border-pink-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-28 h-28 sm:w-40 sm:h-40 bg-purple-600/10 rounded-full blur-[40px]"></div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 sm:w-48 sm:h-48 text-purple-500/5 opacity-50 pointer-events-none"><TattooMotif /></div>

          <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6 relative z-10">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
              <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.36),transparent_60%)] blur-xl opacity-100"></div>
              <div className="absolute inset-x-2 -top-2.5 h-3 rounded-full bg-white/16 blur-[3px]"></div>
              <div className="absolute right-0 top-0 h-3.5 w-3.5 rotate-12 opacity-80"><div className="absolute left-0 top-[1px] h-2 w-2 rounded-full bg-pink-100/55 blur-[0.5px]"></div><div className="absolute right-0 top-[1px] h-2 w-2 rounded-full bg-pink-100/55 blur-[0.5px]"></div><div className="absolute left-1/2 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-pink-100/45 blur-[0.5px]"></div></div>
              <div className="absolute left-[-2px] bottom-3 h-2.5 w-2.5 rotate-[-18deg] opacity-60"><div className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white/50"></div><div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-white/50"></div><div className="absolute left-1/2 top-1 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-white/40"></div></div>
              <div className="absolute left-1/2 top-[-9px] h-4 w-6 -translate-x-1/2"><div className="absolute left-0 top-1.5 h-2.5 w-3.5 -rotate-[28deg] rounded-full border border-pink-100/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(244,114,182,0.18))]"></div><div className="absolute right-0 top-1.5 h-2.5 w-3.5 rotate-[28deg] rounded-full border border-pink-100/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(244,114,182,0.18))]"></div><div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-100/80 shadow-[0_0_8px_rgba(255,255,255,0.75)]"></div></div>
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
                  <button
                    type="button"
                    onClick={() => {
                      if (model.avatar) setPreviewImage({ src: model.avatar, alt: model.name });
                    }}
                    className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-black/80 ring-1 ring-white/10"
                  >
                    <AvatarImage src={model.avatar} alt={model.name} className="w-full h-full object-cover opacity-95" />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">{model.name}</h2>
              <div className="text-xs text-purple-400 tracking-widest mt-1 flex items-center gap-1"><Shield size={12} /><span>{model.roleLabel}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-5 gap-y-3 sm:gap-y-4 relative z-10 mb-5 sm:mb-6 bg-black/40 p-3 sm:p-4 rounded-xl border border-pink-500/10 shadow-inner">
            <StatBar icon={<Brain size={14} />} label="智力" value={model.stats.intelligence} color="bg-blue-500" textColor="text-blue-400" canSpend={model.freeAttributePoints > 0 && model.stats.intelligence < 100} pending={pendingStat === 'intelligence'} onAddOne={() => applyPoint('intelligence', 1)} onAddFive={() => applyPoint('intelligence', 5)} availablePoints={model.freeAttributePoints} />
            <StatBar icon={<Sparkles size={14} />} label="魅力" value={model.stats.charm} color="bg-yellow-500" textColor="text-yellow-400" canSpend={model.freeAttributePoints > 0 && model.stats.charm < 100} pending={pendingStat === 'charm'} onAddOne={() => applyPoint('charm', 1)} onAddFive={() => applyPoint('charm', 5)} availablePoints={model.freeAttributePoints} />
            <StatBar icon={<Activity size={14} />} label="体力" value={model.stats.stamina} color="bg-green-500" textColor="text-green-400" canSpend={model.freeAttributePoints > 0 && model.stats.stamina < 100} pending={pendingStat === 'stamina'} onAddOne={() => applyPoint('stamina', 1)} onAddFive={() => applyPoint('stamina', 5)} availablePoints={model.freeAttributePoints} />
            <StatBar icon={<Flame size={14} />} label="幸运" value={model.stats.luck} color="bg-orange-500" textColor="text-orange-400" canSpend={model.freeAttributePoints > 0 && model.stats.luck < 100} pending={pendingStat === 'luck'} onAddOne={() => applyPoint('luck', 1)} onAddFive={() => applyPoint('luck', 5)} availablePoints={model.freeAttributePoints} />
          </div>

          <div className="space-y-3 sm:space-y-4 relative z-10">
            <div>
              <div className="flex justify-between text-xs mb-1.5"><span className="text-pink-300 flex items-center gap-1 font-bold"><Heart size={12} className="text-pink-500" /> 百合度</span><span className="text-pink-400 font-mono font-bold">{model.yuri}/100</span></div>
              <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-pink-600 to-purple-500 relative shadow-[0_0_10px_rgba(236,72,153,0.5)]" style={{ width: `${Math.max(0, Math.min(100, Math.abs(model.yuri)))}%` }}><div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div></div></div>
            </div>
            <div className="bg-purple-950/40 border border-purple-500/30 rounded-lg p-2.5 sm:p-3 shadow-[0_0_15px_rgba(168,85,247,0.1)]"><div className="text-xs text-purple-400/80 mb-1">直女认知阶段</div><div className="text-sm text-purple-200 font-bold">{model.cognition}</div></div>
            <div className="bg-pink-950/40 border border-pink-500/30 rounded-lg p-2.5 sm:p-3 shadow-[0_0_15px_rgba(236,72,153,0.1)]"><div className="text-xs text-pink-400/80 mb-1">身体敏感变化</div><div className="text-sm text-pink-200 font-bold">{model.sensitivity}</div></div>
          </div>
        </div>

        <div className="bg-[#0a0005]/80 backdrop-blur-xl border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)] shrink-0 relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-36 h-36 sm:w-48 sm:h-48 text-purple-500/5 opacity-50 pointer-events-none rotate-180"><TattooMotif /></div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-200 mb-3 sm:mb-4 flex items-center gap-2 relative z-10"><Crosshair size={16} className="text-purple-400" />攻略情报</h3>
          <div className="space-y-3 sm:space-y-4 relative z-10">
            <div className="relative overflow-hidden rounded-xl border border-fuchsia-400/28 bg-[linear-gradient(135deg,rgba(23,3,31,0.94),rgba(56,8,61,0.82)_45%,rgba(111,15,87,0.72))] p-2.5 sm:p-3 shadow-[0_0_22px_rgba(217,70,239,0.14)]"><div className="pointer-events-none absolute inset-[1px] rounded-[11px] border border-fuchsia-100/8" /><div className="pointer-events-none absolute -left-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-fuchsia-400/16 blur-2xl" /><div className="pointer-events-none absolute right-3 top-0 h-10 w-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_72%)]" /><div className="pointer-events-none absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-200 via-fuchsia-500 to-transparent" /><div className="relative z-10 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-2.5"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-fuchsia-200/30 bg-fuchsia-500/12 text-fuchsia-100 shadow-[0_0_14px_rgba(217,70,239,0.22)]"><Brain size={15} /></div><div className="min-w-0"><div className="text-[10px] tracking-[0.3em] text-fuchsia-100/45">ATTRIBUTE TOKEN</div><span className="mt-1 block text-sm font-semibold text-fuchsia-50/92 drop-shadow-[0_0_8px_rgba(217,70,239,0.2)]">自由属性点</span><div className="mt-1 text-[10px] text-fuchsia-100/55">用于四维加点，1 点兑换 1 属性</div></div></div><span className="shrink-0 rounded-full border border-fuchsia-100/18 bg-black/20 px-3 py-1 text-lg font-mono font-bold text-fuchsia-50 shadow-[inset_0_0_12px_rgba(217,70,239,0.14),0_0_14px_rgba(217,70,239,0.18)]">{model.freeAttributePoints.toLocaleString('zh-CN')}</span></div></div>
            <div className="relative overflow-hidden rounded-xl border border-pink-400/25 bg-[linear-gradient(135deg,rgba(35,3,23,0.92),rgba(44,6,38,0.82)_42%,rgba(88,12,64,0.72))] p-2.5 sm:p-3 shadow-[0_0_20px_rgba(236,72,153,0.14)]"><div className="pointer-events-none absolute inset-[1px] rounded-[11px] border border-pink-200/8" /><div className="pointer-events-none absolute -right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-pink-400/15 blur-2xl" /><div className="pointer-events-none absolute left-3 top-0 h-10 w-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_72%)]" /><div className="pointer-events-none absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-fuchsia-500 to-transparent" /><div className="relative z-10 flex items-center justify-between gap-3"><div className="flex items-center gap-2.5 min-w-0"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-300/30 bg-pink-500/12 text-pink-200 shadow-[0_0_14px_rgba(244,114,182,0.2)]"><Sparkles size={15} /></div><div className="min-w-0"><div className="text-[10px] tracking-[0.32em] text-pink-200/50">EXCHANGE CREDIT</div><span className="mt-1 block text-sm font-semibold text-pink-100/92 drop-shadow-[0_0_8px_rgba(244,114,182,0.22)]">攻略点数</span></div></div><span className="shrink-0 rounded-full border border-pink-200/18 bg-black/20 px-3 py-1 text-lg font-mono font-bold text-pink-100 shadow-[inset_0_0_12px_rgba(244,114,182,0.12),0_0_14px_rgba(244,114,182,0.16)]">{model.strategyPoints.toLocaleString('zh-CN')}</span></div></div>
            <div className="p-2.5 sm:p-3 bg-black/40 rounded-xl border border-pink-500/20 shadow-inner"><span className="text-xs text-pink-300/80 block mb-2">当前攻略路线</span><div className="flex items-center gap-2 text-xs sm:text-sm text-pink-300 font-bold drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"><Flame size={14} className="animate-pulse" />{model.route}</div></div>
          </div>
        </div>
      </div>
      {previewImage ? <ImageLightbox src={previewImage.src} alt={previewImage.alt} onClose={() => setPreviewImage(null)} /> : null}
    </>
  );
}

function StatBar({ icon, label, value, color, textColor, canSpend, pending, onAddOne, onAddFive, availablePoints }: { icon: ReactNode; label: string; value: number; color: string; textColor: string; canSpend: boolean; pending: boolean; onAddOne: () => void; onAddFive: () => void; availablePoints: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex justify-between items-center text-[11px] sm:text-xs ${textColor}`}><span className="flex items-center gap-1 font-bold">{icon} {label}</span><span className="font-mono font-bold">{value}</span></div>
      <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden shadow-inner"><div className={`h-full ${color} shadow-[0_0_10px_currentColor]`} style={{ width: `${value}%` }}></div></div>
      <div className="flex gap-1.5 pt-1"><PointButton onClick={onAddOne} disabled={!canSpend || availablePoints < 1 || pending}>+1</PointButton><PointButton onClick={onAddFive} disabled={!canSpend || availablePoints < 5 || pending}>+5</PointButton></div>
    </div>
  );
}

function PointButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold transition-all ${disabled ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30' : 'border-pink-400/35 bg-pink-500/10 text-pink-200 hover:border-pink-300/60 hover:bg-pink-500/18 hover:shadow-[0_0_12px_rgba(244,114,182,0.2)]'}`}
    >
      {children}
    </button>
  );
}
