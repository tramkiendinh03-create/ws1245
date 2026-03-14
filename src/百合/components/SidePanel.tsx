import _ from 'lodash';
import { useState } from 'react';
import { toDisplayNumber, updateMessageVariables, useStatData } from '../statData';
import { ProtagonistContent } from './ProtagonistPanel';
import { ShopContent } from './ShopPanel';
import { TargetContent } from './TargetPanel';
import { Clock, ShieldAlert, Sparkles, Target, User, Zap } from './icons';

const TargetIcon = Target;
const INVENTORY_PATHS = [
  '物品栏',
  '主控面板.物品栏',
  '主角面板.物品栏',
  '主控面板.数值与养成.物品栏',
  '主角面板.数值与养成.物品栏',
] as const;

type InventoryEntry = {
  id: string;
  label: string;
  sourcePath: string;
  deletePath?: string;
  deleteMode: 'path' | 'array-index' | 'string-token';
  index?: number;
  token?: string;
};

type HeaderData = {
  timeLabel: string;
  disciplineStatus: string;
  taskLabel: string;
  taskStatus: string;
  inventoryItems: InventoryEntry[];
};

const FALLBACK_HEADER_DATA: HeaderData = {
  timeLabel: '14:30 (周二)',
  disciplineStatus: '高 - 走廊巡逻密集',
  taskLabel: '在15:00前，抚摸风纪委员长的裙摆持续5秒。',
  taskStatus: '进行中',
  inventoryItems: [],
};

function toDisplayString(value: unknown, fallback: string): string {
  if (_.isString(value)) {
    const text = value.trim();
    return text || fallback;
  }
  if (_.isNumber(value)) return String(value);
  return fallback;
}

function formatInventoryItem(label: string, value: unknown): string {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue > 1) {
    return `${label}x${numericValue}`;
  }

  const text = toDisplayString(value, '');
  if (text && text !== label) {
    return `${label}:${text}`;
  }

  return label;
}

function findInventorySource(statData: Record<string, any>): { path: string; value: unknown } | null {
  let fallbackSource: { path: string; value: unknown } | null = null;

  for (const path of INVENTORY_PATHS) {
    if (!_.has(statData, path)) continue;

    const value = _.get(statData, path);
    if (!fallbackSource) {
      fallbackSource = { path, value };
    }

    if (buildInventoryEntries(value, path).length > 0) {
      return { path, value };
    }
  }

  return fallbackSource;
}

function buildInventoryEntries(rawInventory: unknown, sourcePath: string): InventoryEntry[] {
  if (_.isString(rawInventory)) {
    return rawInventory
      .split(/[、,，/|]+/)
      .map(item => item.trim())
      .filter(Boolean)
      .map((token, index) => ({
        id: `${sourcePath}-string-${index}`,
        label: token,
        sourcePath,
        deleteMode: 'string-token' as const,
        token,
      }));
  }

  if (_.isArray(rawInventory)) {
    return rawInventory
      .map((item, index) => {
        const label = toDisplayString(item, '').trim();
        if (!label) return null;
        return {
          id: `${sourcePath}-array-${index}`,
          label,
          sourcePath,
          deleteMode: 'array-index' as const,
          index,
        };
      })
      .filter((item): item is InventoryEntry => item !== null);
  }

  if (_.isObject(rawInventory)) {
    return Object.entries(rawInventory as Record<string, unknown>)
      .filter(([, value]) => {
        if (_.isNil(value)) return false;
        if (_.isNumber(value)) return value > 0;
        if (_.isString(value)) return value.trim().length > 0;
        if (_.isArray(value)) return value.length > 0;
        if (_.isObject(value)) return Object.keys(value as Record<string, unknown>).length > 0;
        return true;
      })
      .flatMap(([key, value]) => {
        if (_.isArray(value)) {
          return value
            .map((item, index) => ({
              id: `${sourcePath}.${key}-array-${index}`,
              label: formatInventoryItem(key, item),
              sourcePath: `${sourcePath}.${key}`,
              deleteMode: 'array-index' as const,
              index,
            }))
            .filter(item => item.label.trim().length > 0);
        }

        if (_.isObject(value)) {
          const itemObject = value as Record<string, unknown>;
          const quantity = toDisplayNumber(
            _.get(itemObject, '数量') ?? _.get(itemObject, '库存') ?? _.get(itemObject, '剩余'),
            NaN,
          );
          const description = toDisplayString(
            _.get(itemObject, '描述') ?? _.get(itemObject, '说明') ?? _.get(itemObject, '备注'),
            '',
          );
          const hasStructuredItemFields =
            Number.isFinite(quantity) ||
            description.length > 0 ||
            _.has(itemObject, '数量') ||
            _.has(itemObject, '描述') ||
            _.has(itemObject, '说明') ||
            _.has(itemObject, '备注');

          if (hasStructuredItemFields) {
            const quantitySuffix = Number.isFinite(quantity) && quantity > 1 ? ` ×${quantity}` : '';
            return [
              {
                id: `${sourcePath}.${key}`,
                label: `${key}${quantitySuffix}`,
                sourcePath,
                deletePath: `${sourcePath}.${key}`,
                deleteMode: 'path' as const,
              },
            ];
          }

          return Object.entries(itemObject)
            .filter(([, nestedValue]) => {
              if (_.isNil(nestedValue)) return false;
              if (_.isNumber(nestedValue)) return nestedValue > 0;
              return toDisplayString(nestedValue, '').trim().length > 0;
            })
            .map(([nestedKey, nestedValue]) => ({
              id: `${sourcePath}.${key}.${nestedKey}`,
              label: formatInventoryItem(`${key}-${nestedKey}`, nestedValue),
              sourcePath,
              deletePath: `${sourcePath}.${key}.${nestedKey}`,
              deleteMode: 'path' as const,
            }));
        }

        return [
          {
            id: `${sourcePath}.${key}`,
            label: formatInventoryItem(key, value),
            sourcePath,
            deletePath: `${sourcePath}.${key}`,
            deleteMode: 'path' as const,
          },
        ];
      });
  }

  return [];
}

function readHeaderData(statData: Record<string, any>): HeaderData {
  if (!_.isObject(statData)) return FALLBACK_HEADER_DATA;

  const inventorySource = findInventorySource(statData);

  return {
    timeLabel: toDisplayString(
      _.get(statData, '当前时间.时间提示') ?? _.get(statData, '当前时间') ?? _.get(statData, '时间提示'),
      FALLBACK_HEADER_DATA.timeLabel,
    ),
    disciplineStatus: toDisplayString(
      _.get(statData, '校园风纪状态') ?? _.get(statData, '风纪状态') ?? _.get(statData, '当前风纪状态'),
      FALLBACK_HEADER_DATA.disciplineStatus,
    ),
    taskLabel: toDisplayString(
      _.get(statData, '系统任务.当前任务') ?? _.get(statData, '当前任务') ?? _.get(statData, '任务'),
      FALLBACK_HEADER_DATA.taskLabel,
    ),
    taskStatus: toDisplayString(
      _.get(statData, '系统任务.任务类型') ?? _.get(statData, '系统任务.状态') ?? _.get(statData, '任务状态'),
      FALLBACK_HEADER_DATA.taskStatus,
    ),
    inventoryItems: inventorySource ? buildInventoryEntries(inventorySource.value, inventorySource.path) : [],
  };
}

function cleanupEmptyContainers(statData: Record<string, any>, path: string) {
  const segments = _.toPath(path);

  for (let length = segments.length; length > 0; length -= 1) {
    const currentPath = segments.slice(0, length).join('.');
    const value = _.get(statData, currentPath);

    if (_.isArray(value) && value.length === 0) {
      _.unset(statData, currentPath);
      continue;
    }

    if (_.isObject(value) && !_.isArray(value) && Object.keys(value as Record<string, unknown>).length === 0) {
      _.unset(statData, currentPath);
      continue;
    }

    break;
  }
}

export function SidePanel() {
  const [activeTab, setActiveTab] = useState<'protagonist' | 'target' | 'shop'>('target');
  const [pendingInventoryId, setPendingInventoryId] = useState<string | null>(null);
  const headerData = useStatData(readHeaderData);

  const removeInventoryItem = (entry: InventoryEntry) => {
    if (pendingInventoryId) return;
    setPendingInventoryId(entry.id);

    const updated = updateMessageVariables(variables => {
      const statData = _.get(variables, 'stat_data');
      if (!_.isObject(statData)) return;

      if (entry.deleteMode === 'path' && entry.deletePath) {
        _.unset(statData, entry.deletePath);
        cleanupEmptyContainers(statData, entry.deletePath);
        return;
      }

      if (entry.deleteMode === 'array-index') {
        const list = _.get(statData, entry.sourcePath);
        if (!_.isArray(list) || !_.isNumber(entry.index)) return;
        list.splice(entry.index, 1);
        if (list.length === 0) {
          _.unset(statData, entry.sourcePath);
          cleanupEmptyContainers(statData, entry.sourcePath);
        }
        return;
      }

      if (entry.deleteMode === 'string-token') {
        const raw = _.get(statData, entry.sourcePath);
        if (!_.isString(raw) || !entry.token) return;

        const items = raw
          .split(/[、,，/|]+/)
          .map(item => item.trim())
          .filter(Boolean);
        const removeIndex = items.findIndex(item => item === entry.token);
        if (removeIndex === -1) return;
        items.splice(removeIndex, 1);

        if (items.length === 0) {
          _.unset(statData, entry.sourcePath);
          cleanupEmptyContainers(statData, entry.sourcePath);
        } else {
          _.set(statData, entry.sourcePath, items.join(' / '));
        }
      }
    });

    window.setTimeout(() => setPendingInventoryId(null), updated ? 220 : 0);
  };

  return (
    <aside className="w-full max-w-[384px] sm:max-w-[408px] flex flex-col shrink-0 relative z-10 gap-2.5 sm:gap-3 rounded-2xl border border-pink-500/15 bg-[#070106]/88 backdrop-blur-xl px-2.5 py-2.5 sm:px-3 sm:py-3 shadow-[0_0_32px_rgba(236,72,153,0.1)]">
      <div className="relative z-10 flex flex-col gap-2 sm:gap-2.5 shrink-0">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:justify-between sm:items-center px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0a0005]/72 backdrop-blur-xl border border-pink-500/20 rounded-xl shadow-[0_0_24px_rgba(236,72,153,0.08)] relative overflow-hidden group">
          <div className="pointer-events-none absolute inset-[5px] rounded-[10px] border border-pink-400/15" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_68%)] opacity-90" />
          <div className="pointer-events-none absolute -left-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-pink-500/8 blur-xl" />
          <div className="pointer-events-none absolute -right-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-fuchsia-500/8 blur-xl" />
          <div className="pointer-events-none absolute left-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-pink-400/18" />
          <div className="pointer-events-none absolute right-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full border border-fuchsia-400/14" />
          <div className="pointer-events-none absolute inset-x-16 top-[7px] h-px bg-gradient-to-r from-transparent via-pink-300/45 to-transparent" />
          <div className="pointer-events-none absolute inset-x-16 bottom-[7px] h-px bg-gradient-to-r from-transparent via-fuchsia-300/28 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-[5px] h-3 w-6 -translate-x-1/2">
            <div className="absolute left-0 top-1 h-2 w-3 -rotate-[28deg] rounded-full border border-pink-100/28 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(244,114,182,0.12))]" />
            <div className="absolute right-0 top-1 h-2 w-3 rotate-[28deg] rounded-full border border-pink-100/28 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(244,114,182,0.12))]" />
            <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-100/75" />
          </div>
          <div className="pointer-events-none absolute right-10 bottom-2 h-2 w-5 rounded-full border border-fuchsia-200/14 bg-[linear-gradient(90deg,rgba(244,114,182,0.22),rgba(255,255,255,0.04))] opacity-85" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center gap-2 text-pink-300 relative z-10">
            <Clock size={16} />
            <span className="text-sm font-medium tracking-wider">{headerData.timeLabel}</span>
          </div>

          <div className="flex items-center gap-2 text-rose-400 relative z-10">
            <ShieldAlert size={16} />
            <span className="text-xs font-bold tracking-widest">风纪状态: {headerData.disciplineStatus}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 bg-[#0a0005]/72 backdrop-blur-xl border border-pink-500/30 rounded-xl shadow-[0_0_24px_rgba(236,72,153,0.12)] relative overflow-hidden group">
          <div className="pointer-events-none absolute inset-[6px] rounded-[12px] border border-pink-400/16" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-12 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_72%)]" />
          <div className="pointer-events-none absolute left-12 top-[10px] h-5 w-10 rounded-full border border-pink-300/16 border-r-transparent border-b-transparent" />
          <div className="pointer-events-none absolute right-10 bottom-[10px] h-6 w-12 rounded-full border border-fuchsia-300/14 border-l-transparent border-t-transparent" />
          <div className="pointer-events-none absolute right-4 top-3 h-8 w-8 rounded-full border border-pink-400/12" />
          <div className="pointer-events-none absolute left-4 bottom-3 h-9 w-9 rounded-full border border-fuchsia-400/10" />
          <div className="pointer-events-none absolute inset-x-14 top-[8px] h-px bg-gradient-to-r from-transparent via-pink-300/38 to-transparent" />
          <div className="pointer-events-none absolute left-[58px] top-2 h-3 w-6">
            <div className="absolute left-0 top-1 h-2.5 w-3.5 -rotate-[28deg] rounded-full border border-pink-100/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(244,114,182,0.14))]" />
            <div className="absolute right-0 top-1 h-2.5 w-3.5 rotate-[28deg] rounded-full border border-pink-100/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(244,114,182,0.14))]" />
            <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-100/80 shadow-[0_0_6px_rgba(255,255,255,0.65)]" />
          </div>
          <div className="pointer-events-none absolute right-12 bottom-3 h-2.5 w-7 rounded-full border border-fuchsia-100/16 bg-[linear-gradient(90deg,rgba(244,114,182,0.28),rgba(255,255,255,0.05))] opacity-80" />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 shrink-0 relative z-10 mt-0.5 sm:mt-1 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <TargetIcon size={18} />
          </div>

          <div className="flex-1 relative z-10">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                  互动任务
                </span>
                <span className="text-[10px] text-pink-500/60 tracking-widest">SYSTEM OVERRIDE</span>
              </div>

              <div className="shrink-0 flex items-center gap-1 text-[9px] sm:text-[10px] text-pink-300 bg-pink-950/50 px-2 py-1 rounded-full border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                <Zap size={12} className="animate-pulse text-pink-400" />
                <span>{headerData.taskStatus}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed">{headerData.taskLabel}</p>
          </div>
        </div>

        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0a0005]/64 backdrop-blur-xl border border-pink-500/18 rounded-xl shadow-[0_0_18px_rgba(236,72,153,0.08)] relative overflow-hidden min-h-[118px] sm:min-h-[134px]">
          <div className="pointer-events-none absolute inset-[5px] rounded-[10px] border border-pink-400/10" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-pink-500/65 via-fuchsia-400/25 to-transparent" />
          <div className="pointer-events-none absolute left-5 top-0 h-10 w-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_72%)]" />
          <div className="relative z-10 flex items-start gap-2">
            <div className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-full border border-pink-400/25 bg-pink-500/10 text-pink-300">
              <Target size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold tracking-[0.28em] text-pink-300/70">物品栏</div>
              {headerData.inventoryItems.length > 0 ? (
                <div className="mt-2 flex max-h-[112px] sm:max-h-[132px] flex-wrap content-start gap-1.5 overflow-y-auto pr-1 custom-scrollbar">
                  {headerData.inventoryItems.map(item => (
                    <div
                      key={item.id}
                      className="inline-flex max-w-full items-center gap-1 rounded-full border border-pink-400/25 bg-pink-950/35 px-2.5 py-1 text-[11px] text-pink-100/92 shadow-[0_0_12px_rgba(236,72,153,0.08)]"
                    >
                      <span className="truncate">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => removeInventoryItem(item)}
                        disabled={pendingInventoryId === item.id}
                        className={`shrink-0 rounded-full border px-1.5 py-[1px] text-[10px] leading-none transition-all ${
                          pendingInventoryId === item.id
                            ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                            : 'border-pink-300/35 bg-pink-500/10 text-pink-200 hover:border-pink-200/60 hover:bg-pink-500/18'
                        }`}
                        aria-label={`删除${item.label}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-1 text-xs sm:text-[13px] leading-relaxed text-pink-100/60">暂无物品</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex p-1 bg-[#0a0005]/72 backdrop-blur-xl border border-pink-500/20 rounded-xl shadow-[0_0_24px_rgba(236,72,153,0.08)] shrink-0 gap-1">
        <button
          onClick={() => setActiveTab('protagonist')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 'protagonist'
              ? 'bg-gradient-to-r from-purple-600/30 to-pink-900/40 text-pink-200 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
              : 'text-gray-500 hover:text-pink-300 hover:bg-pink-500/5 border border-transparent'
          }`}
        >
          <User size={14} />
          主控
        </button>

        <button
          onClick={() => setActiveTab('target')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 'target'
              ? 'bg-gradient-to-r from-pink-600/30 to-rose-900/40 text-pink-200 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
              : 'text-gray-500 hover:text-pink-300 hover:bg-pink-500/5 border border-transparent'
          }`}
        >
          <Target size={14} />
          目标
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold transition-all duration-300 ${
            activeTab === 'shop'
              ? 'bg-gradient-to-r from-fuchsia-600/28 to-pink-900/44 text-pink-100 border border-fuchsia-400/40 shadow-[0_0_20px_rgba(217,70,239,0.18)]'
              : 'text-gray-500 hover:text-pink-300 hover:bg-pink-500/5 border border-transparent'
          }`}
        >
          <Sparkles size={14} />
          商城
        </button>
      </div>

      <div className="relative z-10 flex flex-col max-h-[56vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
        {activeTab === 'protagonist' ? <ProtagonistContent /> : activeTab === 'target' ? <TargetContent /> : <ShopContent />}
      </div>
    </aside>
  );
}



