import React, { useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';

interface WorldState {
  time: string;
  location: string;
  task: string;
}

interface EquipmentState {
  top: string;
  bottom: string;
  shoes: string;
  accessory: string;
}

interface ProtagonistState {
  name: string;
  gender: string;
  identity: string;
  age: number;
  equipment: EquipmentState;
}

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  sourcePath: string;
  deleteMode: 'path' | 'array-index';
  deletePath?: string;
  index?: number;
}

interface NPCState {
  id: string;
  name: string;
  gender: string;
  identity: string;
  age: number;
  favorability: number;
  sourcePath?: string;
  sourceKey?: string;
}

interface WuxiaViewModel {
  world: WorldState;
  protagonist: ProtagonistState;
  inventory: InventoryItem[];
  npcs: NPCState[];
}

type ActiveModal = 'protagonist' | 'inventory' | 'npc' | null;
type PendingDelete =
  | { type: 'inventory'; item: InventoryItem }
  | { type: 'npc'; npc: NPCState }
  | null;

type TavernHelperLike = {
  getVariables?: (option: { type: 'message'; message_id?: number | 'latest' }) => Record<string, unknown>;
  replaceVariables?: (
    variables: Record<string, unknown>,
    option: { type: 'message'; message_id?: number | 'latest' },
  ) => void;
};

type ToastrLike = {
  success?: (message: string) => void;
  error?: (message: string) => void;
};

const FALLBACK_VIEW_MODEL: WuxiaViewModel = {
  world: { time: '等待变量', location: '等待变量', task: '请在消息楼层变量中提供 stat_data' },
  protagonist: {
    name: '待接入角色',
    gender: '未知',
    identity: '等待变量',
    age: 0,
    equipment: { top: '暂无数据', bottom: '暂无数据', shoes: '暂无数据', accessory: '暂无数据' },
  },
  inventory: [],
  npcs: [],
};

const ROLE_ROOT_PATHS = ['角色', '人物', '角色列表', '人物列表'] as const;
const PROTAGONIST_ROOT_PATHS = ['主角', '主控', '玩家', '我'] as const;
const INVENTORY_PATHS = [
  '主角.物品栏',
  '主角.物品',
  '主角.随身物品',
  '主角.背包',
  '主控.物品栏',
  '主控.物品',
  '主控.随身物品',
  '主控.背包',
  '物品栏',
  '随身物品',
  '背包',
  '物品',
  '道具',
] as const;

function toDisplayString(value: unknown, fallback = ''): string {
  if (_.isString(value)) {
    const text = value.trim();
    return text || fallback;
  }
  if (_.isNumber(value)) return String(value);
  return fallback;
}

function toDisplayNumber(value: unknown, fallback = 0): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function getToastr() {
  return (globalThis as { toastr?: ToastrLike }).toastr;
}

function notifySuccess(message: string) {
  getToastr()?.success?.(message) ?? console.info('[wuxia]', message);
}

function notifyError(message: string) {
  getToastr()?.error?.(message) ?? console.error('[wuxia]', message);
}

function getHelper() {
  return (globalThis as { TavernHelper?: TavernHelperLike }).TavernHelper;
}

function getMessageVariablesSafe(): Record<string, unknown> {
  try {
    if (typeof getVariables === 'function') {
      return (getVariables({ type: 'message' }) as Record<string, unknown>) ?? {};
    }
  } catch {}

  try {
    return (getHelper()?.getVariables?.({ type: 'message' }) as Record<string, unknown>) ?? {};
  } catch {
    return {};
  }
}

function updateMessageVariables(updater: (variables: Record<string, unknown>) => boolean | void): boolean {
  try {
    if (typeof getVariables === 'function' && typeof replaceVariables === 'function') {
      const variables = _.cloneDeep((getVariables({ type: 'message' }) as Record<string, unknown>) ?? {});
      if (updater(variables) === false) return false;
      replaceVariables(variables, { type: 'message' });
      return true;
    }
  } catch {}

  try {
    const helper = getHelper();
    if (!helper?.getVariables || !helper?.replaceVariables) return false;

    const variables = _.cloneDeep((helper.getVariables({ type: 'message' }) as Record<string, unknown>) ?? {});
    if (updater(variables) === false) return false;
    helper.replaceVariables(variables, { type: 'message' });
    return true;
  } catch {
    return false;
  }
}

function cleanupEmptyContainers(statData: Record<string, unknown>, path: string) {
  const segments = _.toPath(path);

  for (let length = segments.length; length > 0; length -= 1) {
    const currentPath = segments.slice(0, length).join('.');
    const value = _.get(statData, currentPath);

    if (_.isArray(value) && value.length === 0) {
      _.unset(statData, currentPath);
      continue;
    }

    if (_.isPlainObject(value) && Object.keys(value).length === 0) {
      _.unset(statData, currentPath);
      continue;
    }

    break;
  }
}

function getStatData(): Record<string, unknown> {
  const statData = _.get(getMessageVariablesSafe(), 'stat_data');
  return _.isPlainObject(statData) ? statData : {};
}

function getRoleRoot(statData: Record<string, unknown>): { path: string; value: Record<string, unknown> } | null {
  for (const path of ROLE_ROOT_PATHS) {
    const value = _.get(statData, path);
    if (_.isPlainObject(value)) return { path, value };
  }
  return null;
}

function getRoleEntries(statData: Record<string, unknown>): Array<[string, Record<string, unknown>]> {
  const root = getRoleRoot(statData)?.value;
  if (!root) return [];
  return Object.entries(root).filter(([, value]) => _.isPlainObject(value)) as Array<[string, Record<string, unknown>]>;
}

function resolveWorld(statData: Record<string, unknown>): WorldState {
  const world = _.get(statData, '世界') ?? _.get(statData, 'world');
  return {
    time: toDisplayString(_.get(world, '当前时间') ?? _.get(world, '时间') ?? _.get(world, '时辰'), FALLBACK_VIEW_MODEL.world.time),
    location: toDisplayString(_.get(world, '当前地点') ?? _.get(world, '地点') ?? _.get(world, '位置'), FALLBACK_VIEW_MODEL.world.location),
    task: toDisplayString(
      _.get(world, '准备做的任务') ?? _.get(world, '当前任务') ?? _.get(world, '任务') ?? _.get(world, '目标'),
      FALLBACK_VIEW_MODEL.world.task,
    ),
  };
}

function resolveEquipment(role: Record<string, unknown>): EquipmentState {
  const equipment =
    _.get(role, '着装') ??
    _.get(role, '穿搭') ??
    _.get(role, '服饰') ??
    _.get(role, '装备') ??
    _.get(role, '穿着') ??
    _.get(role, '衣着');

  return {
    top: toDisplayString(_.get(equipment, '上装') ?? _.get(role, '上装') ?? _.get(role, '衣服'), '暂无数据'),
    bottom: toDisplayString(_.get(equipment, '下装') ?? _.get(role, '下装') ?? _.get(role, '裤装'), '暂无数据'),
    shoes: toDisplayString(_.get(equipment, '鞋子') ?? _.get(equipment, '鞋履') ?? _.get(role, '鞋子') ?? _.get(role, '鞋履'), '暂无数据'),
    accessory: toDisplayString(_.get(equipment, '饰品') ?? _.get(equipment, '配饰') ?? _.get(role, '饰品') ?? _.get(role, '配饰'), '暂无数据'),
  };
}

function resolveProtagonist(statData: Record<string, unknown>): ProtagonistState {
  for (const path of PROTAGONIST_ROOT_PATHS) {
    const direct = _.get(statData, path);
    if (!_.isPlainObject(direct)) continue;

    return {
      name: toDisplayString(_.get(direct, '姓名') ?? _.get(direct, '名字'), FALLBACK_VIEW_MODEL.protagonist.name),
      gender: toDisplayString(_.get(direct, '性别'), FALLBACK_VIEW_MODEL.protagonist.gender),
      identity: toDisplayString(
        _.get(direct, '身份') ?? _.get(direct, '身份信息') ?? _.get(direct, '身份定位'),
        FALLBACK_VIEW_MODEL.protagonist.identity,
      ),
      age: toDisplayNumber(_.get(direct, '年龄'), FALLBACK_VIEW_MODEL.protagonist.age),
      equipment: resolveEquipment(direct),
    };
  }

  const [firstRoleKey, firstRole] = getRoleEntries(statData)[0] ?? [];
  if (_.isPlainObject(firstRole)) {
    return {
      name: toDisplayString(_.get(firstRole, '姓名') ?? _.get(firstRole, '名字') ?? firstRoleKey, FALLBACK_VIEW_MODEL.protagonist.name),
      gender: toDisplayString(_.get(firstRole, '性别'), FALLBACK_VIEW_MODEL.protagonist.gender),
      identity: toDisplayString(
        _.get(firstRole, '身份') ?? _.get(firstRole, '身份信息') ?? _.get(firstRole, '身份定位'),
        FALLBACK_VIEW_MODEL.protagonist.identity,
      ),
      age: toDisplayNumber(_.get(firstRole, '年龄'), FALLBACK_VIEW_MODEL.protagonist.age),
      equipment: resolveEquipment(firstRole),
    };
  }

  return FALLBACK_VIEW_MODEL.protagonist;
}

function resolveInventory(statData: Record<string, unknown>): InventoryItem[] {
  const items: InventoryItem[] = [];

  INVENTORY_PATHS.forEach(path => {
    const root = _.get(statData, path);
    if (_.isNil(root)) return;

    if (_.isArray(root)) {
      root.forEach((item, index) => {
        if (_.isNil(item)) return;

        if (_.isPlainObject(item)) {
          const quantity = Math.max(0, toDisplayNumber(_.get(item, '数量') ?? _.get(item, 'count') ?? _.get(item, '库存'), 1));
          if (quantity <= 0) return;

          items.push({
            id: `${path}-array-${index}`,
            name: toDisplayString(_.get(item, '名称') ?? _.get(item, '名字'), `物品 ${index + 1}`),
            description: toDisplayString(_.get(item, '描述') ?? _.get(item, '说明') ?? _.get(item, '备注'), '暂无描述'),
            quantity,
            sourcePath: path,
            deleteMode: 'array-index',
            index,
          });
          return;
        }

        const label = toDisplayString(item, '').trim();
        if (!label) return;

        items.push({
          id: `${path}-array-${index}`,
          name: label,
          description: '暂无描述',
          quantity: 1,
          sourcePath: path,
          deleteMode: 'array-index',
          index,
        });
      });
      return;
    }

    if (_.isPlainObject(root)) {
      Object.entries(root).forEach(([key, value]) => {
        if (_.isNil(value)) return;

        if (_.isPlainObject(value)) {
          const quantity = Math.max(0, toDisplayNumber(_.get(value, '数量') ?? _.get(value, 'count') ?? _.get(value, '库存'), 1));
          if (quantity <= 0) return;

          items.push({
            id: `${path}.${key}`,
            name: toDisplayString(_.get(value, '名称') ?? _.get(value, '名字') ?? key, key),
            description: toDisplayString(_.get(value, '描述') ?? _.get(value, '说明') ?? _.get(value, '备注'), '暂无描述'),
            quantity,
            sourcePath: path,
            deleteMode: 'path',
            deletePath: `${path}.${key}`,
          });
          return;
        }

        const quantity = _.isNumber(value) ? Math.max(0, value) : 1;
        if (quantity <= 0) return;

        items.push({
          id: `${path}.${key}`,
          name: key,
          description: _.isString(value) ? value : '暂无描述',
          quantity,
          sourcePath: path,
          deleteMode: 'path',
          deletePath: `${path}.${key}`,
        });
      });
    }
  });

  return _.uniqBy(items, item => item.id);
}

function resolveNpcs(statData: Record<string, unknown>, protagonist: ProtagonistState): NPCState[] {
  const roleRoot = getRoleRoot(statData);
  if (!roleRoot) return [];

  return Object.entries(roleRoot.value)
    .filter(([, role]) => _.isPlainObject(role))
    .map(([key, role]) => {
      const record = role as Record<string, unknown>;
      const name = toDisplayString(_.get(record, '姓名') ?? _.get(record, '名字') ?? key, key);

      return {
        id: `${roleRoot.path}.${key}`,
        name,
        gender: toDisplayString(_.get(record, '性别'), '未知'),
        identity: toDisplayString(
          _.get(record, '身份') ?? _.get(record, '身份信息') ?? _.get(record, '身份定位'),
          '暂无身份',
        ),
        age: toDisplayNumber(_.get(record, '年龄'), 0),
        favorability: _.clamp(
          toDisplayNumber(
            _.get(record, '好感度') ?? _.get(record, '信任度') ?? _.get(record, '关系值') ?? _.get(record, '亲密度'),
            0,
          ),
          0,
          100,
        ),
        sourcePath: roleRoot.path,
        sourceKey: key,
      };
    })
    .filter(npc => npc.name !== protagonist.name);
}

function buildViewModel(statData: Record<string, unknown>): WuxiaViewModel {
  if (!Object.keys(statData).length) return FALLBACK_VIEW_MODEL;

  const protagonist = resolveProtagonist(statData);
  return {
    world: resolveWorld(statData),
    protagonist,
    inventory: resolveInventory(statData),
    npcs: resolveNpcs(statData, protagonist),
  };
}

function useWuxiaViewModel(interval = 400): WuxiaViewModel {
  const [value, setValue] = useState<WuxiaViewModel>(() => buildViewModel(getStatData()));
  const lastSnapshotRef = useRef(JSON.stringify(value));

  useEffect(() => {
    const sync = () => {
      const next = buildViewModel(getStatData());
      const snapshot = JSON.stringify(next);
      if (snapshot === lastSnapshotRef.current) return;
      lastSnapshotRef.current = snapshot;
      setValue(next);
    };

    sync();
    const timer = window.setInterval(sync, interval);
    return () => window.clearInterval(timer);
  }, [interval]);

  return value;
}

function deleteInventoryFromVariables(item: InventoryItem): boolean {
  return updateMessageVariables(variables => {
    const statData = _.get(variables, 'stat_data');
    if (!_.isPlainObject(statData)) return false;

    if (item.deleteMode === 'path' && item.deletePath) {
      _.unset(statData, item.deletePath);
      cleanupEmptyContainers(statData, item.deletePath);
      return true;
    }

    if (item.deleteMode === 'array-index') {
      const list = _.get(statData, item.sourcePath);
      if (!_.isArray(list) || !_.isNumber(item.index)) return false;
      if (item.index < 0 || item.index >= list.length) return false;

      list.splice(item.index, 1);
      if (list.length === 0) _.unset(statData, item.sourcePath);
      cleanupEmptyContainers(statData, item.sourcePath);
      return true;
    }

    return false;
  });
}

function deleteNpcFromVariables(npc: NPCState): boolean {
  return updateMessageVariables(variables => {
    const statData = _.get(variables, 'stat_data');
    if (!_.isPlainObject(statData) || !npc.sourcePath || !npc.sourceKey) return false;

    const targetPath = `${npc.sourcePath}.${npc.sourceKey}`;
    if (!_.has(statData, targetPath)) return false;
    _.unset(statData, targetPath);
    cleanupEmptyContainers(statData, targetPath);
    return true;
  });
}

function Icon({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const MapPinIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M12 21s-6-5.2-6-11a6 6 0 1 1 12 0c0 5.8-6 11-6 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Icon>
);

const ClockIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5v5l3 2" />
  </Icon>
);

const ScrollIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M7 5.5h8a2.5 2.5 0 0 1 0 5H9.5A2.5 2.5 0 0 0 7 13v3a2.5 2.5 0 0 0 2.5 2.5H17" />
    <path d="M7 5.5A2.5 2.5 0 0 0 4.5 8v8A2.5 2.5 0 0 0 7 18.5" />
  </Icon>
);

const UserIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
  </Icon>
);

const PackageIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="m12 3 7 4-7 4-7-4 7-4Z" />
    <path d="M5 7v10l7 4 7-4V7" />
    <path d="M12 11v10" />
  </Icon>
);

const ShieldIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M12 3 6.5 5v5.5c0 4 2.4 7.3 5.5 8.5 3.1-1.2 5.5-4.5 5.5-8.5V5L12 3Z" />
  </Icon>
);

const XIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </Icon>
);

const UsersIcon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M16.5 19a4.5 4.5 0 0 0-9 0" />
    <circle cx="12" cy="9" r="3" />
    <path d="M19.5 19a3.5 3.5 0 0 0-2.7-3.4" />
    <path d="M7.2 15.6A3.5 3.5 0 0 0 4.5 19" />
  </Icon>
);

const Trash2Icon = ({ className = '' }: { className?: string }) => (
  <Icon className={className}>
    <path d="M4.5 7.5h15" />
    <path d="M9.5 3.5h5" />
    <path d="M7.5 7.5v11a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-11" />
    <path d="M10 11v5.5" />
    <path d="M14 11v5.5" />
  </Icon>
);

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-1.5 backdrop-blur-sm sm:p-3" onClick={onClose}>
      <div
        onClick={event => event.stopPropagation()}
        className="relative max-h-[94vh] w-full max-w-[min(96vw,68rem)] overflow-y-auto rounded-[1rem] border border-wuxia-gold/25 bg-[#0f0f12]/95 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:max-h-[92vh] sm:rounded-[1.4rem]"
      >
        <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-wuxia-gold/10 via-transparent to-transparent px-4 py-3 sm:px-7 sm:py-5">
          <h2 className="pr-4 font-serif text-base tracking-[0.18em] text-wuxia-gold sm:text-2xl sm:tracking-[0.24em]">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full border border-transparent p-1 text-gray-500 transition-colors hover:border-wuxia-gold/30 hover:text-wuxia-gold">
            <XIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <div className="p-3 sm:p-5 lg:p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmPanel({
  isOpen,
  title,
  message,
  confirmLabel = '确认删除',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4" onClick={onCancel}>
      <div
        onClick={event => event.stopPropagation()}
        className="relative w-full max-w-[min(92vw,32rem)] overflow-hidden rounded-[1.25rem] border border-wuxia-red/35 bg-[#100c0d]/96 shadow-[0_0_40px_rgba(0,0,0,0.72),0_0_24px_rgba(139,28,28,0.24)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,28,28,0.18),transparent_52%)]" />
        <div className="relative border-b border-white/8 px-5 py-4 sm:px-6">
          <div className="text-[0.72rem] tracking-[0.28em] text-wuxia-red/80">操作确认</div>
          <h3 className="mt-1 font-serif text-lg tracking-[0.12em] text-white sm:text-xl">{title}</h3>
        </div>
        <div className="relative px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-sm leading-7 text-gray-200 sm:text-base">{message}</p>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm tracking-[0.12em] text-gray-300 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-full border border-wuxia-red/45 bg-wuxia-red/18 px-4 py-2 text-sm tracking-[0.12em] text-white transition-colors hover:border-wuxia-red/65 hover:bg-wuxia-red/28"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
  accent = false,
  accentJade = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: boolean;
  accentJade?: boolean;
}) {
  const valueClassName = highlight
    ? 'text-right text-base font-medium text-white sm:text-lg'
    : accent
      ? 'text-right text-wuxia-gold'
      : accentJade
        ? 'text-right text-wuxia-jade'
        : 'text-right text-white';

  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-2 first:border-t-0 first:pt-0">
      <span className="text-gray-400">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function ProtagonistContent({ data }: { data: ProtagonistState }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
      <div>
        <div className="mb-5 flex items-center border-b border-white/10 pb-3">
          <UserIcon className="mr-3 h-5 w-5 text-wuxia-gold" />
          <h3 className="text-lg tracking-[0.18em] text-gray-200 sm:text-xl">生平</h3>
        </div>
        <div className="space-y-4 text-sm sm:text-base">
          <InfoRow label="姓名" value={data.name} highlight />
          <InfoRow label="性别" value={data.gender} />
          <InfoRow label="年龄" value={data.age > 0 ? `${data.age} 岁` : '未知'} />
          <InfoRow label="身份" value={data.identity} accent />
        </div>
      </div>
      <div>
        <div className="mb-5 flex items-center border-b border-white/10 pb-3">
          <ShieldIcon className="mr-3 h-5 w-5 text-wuxia-gold" />
          <h3 className="text-lg tracking-[0.18em] text-gray-200 sm:text-xl">服饰</h3>
        </div>
        <div className="space-y-4 text-sm sm:text-base">
          <InfoRow label="上装" value={data.equipment.top} />
          <InfoRow label="下装" value={data.equipment.bottom} />
          <InfoRow label="鞋子" value={data.equipment.shoes} />
          <InfoRow label="饰品" value={data.equipment.accessory} accentJade />
        </div>
      </div>
    </div>
  );
}

function InventoryContent({
  data,
  pendingDeleteId,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  data: InventoryItem[];
  pendingDeleteId: string | null;
  onDelete: (item: InventoryItem) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[58rem] flex-col gap-4">
      {data.map(item => (
        <div key={item.id} className="group relative overflow-hidden rounded-[1rem] border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-wuxia-gold/30 hover:bg-white/[0.05] sm:p-5">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-wuxia-gold/0 transition-colors group-hover:bg-wuxia-gold/50" />
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="break-words text-lg font-medium tracking-[0.12em] text-wuxia-gold sm:text-xl">{item.name}</h4>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <button type="button" onClick={() => onDelete(item)} className="order-2 rounded-full border border-transparent p-1.5 text-gray-500 transition-colors hover:border-wuxia-red/30 hover:bg-wuxia-red/10 hover:text-wuxia-red sm:order-none" title="删除物品">
                  <Trash2Icon className="h-4 w-4" />
                </button>
                <span className="order-1 flex items-center rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-gray-300 sm:order-none sm:text-sm">
                  <PackageIcon className="mr-2 h-3.5 w-3.5 opacity-50" />
                  数量: {item.quantity}
                </span>
              </div>
            </div>
            <p className="max-w-[44rem] text-sm leading-7 text-gray-300 sm:text-base">{item.description}</p>
          </div>
          {pendingDeleteId === item.id ? (
            <div className="mt-4 rounded-[0.9rem] border border-wuxia-red/30 bg-[#160f10]/92 p-3">
              <div className="text-[11px] tracking-[0.22em] text-wuxia-red/75">删除确认</div>
              <p className="mt-2 text-sm leading-6 text-gray-200">确认删除物品“{item.name}”吗？此操作会同步清除变量。</p>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={onCancelDelete} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs tracking-[0.12em] text-gray-300 transition-colors hover:border-white/20 hover:text-white">取消</button>
                <button type="button" onClick={onConfirmDelete} className="rounded-full border border-wuxia-red/40 bg-wuxia-red/15 px-3 py-1.5 text-xs tracking-[0.12em] text-white transition-colors hover:border-wuxia-red/60 hover:bg-wuxia-red/25">确认删除</button>
              </div>
            </div>
          ) : null}
        </div>
      ))}
      {data.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center text-gray-500">
          <PackageIcon className="mb-4 h-12 w-12 opacity-20" />
          <p className="text-base tracking-[0.2em] sm:text-lg">当前没有可展示的随身物品</p>
        </div>
      ) : null}
    </div>
  );
}

function getNpcRelationshipText(favorability: number) {
  if (favorability >= 80) return '引为心腹，荣辱与共。';
  if (favorability >= 50) return '往来密切，可借其力。';
  return '尚在试探，需再观察。';
}

function NPCContent({
  data,
  pendingDeleteId,
  onDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  data: NPCState[];
  pendingDeleteId: string | null;
  onDelete: (npc: NPCState) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[62rem] flex-col gap-4">
      {data.map(npc => (
        <div key={npc.id} className="group relative flex flex-col gap-4 overflow-hidden rounded-[1rem] border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-wuxia-red/30 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:p-5">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-wuxia-red/0 transition-colors group-hover:bg-wuxia-red/50" />
          <button type="button" onClick={() => onDelete(npc)} className="absolute right-3 top-3 rounded-full border border-transparent p-1.5 text-gray-500 transition-colors hover:border-wuxia-red/30 hover:bg-wuxia-red/10 hover:text-wuxia-red sm:right-4 sm:top-4" title="删除人物关系">
            <Trash2Icon className="h-4 w-4" />
          </button>
          <div className="relative flex-shrink-0 self-start sm:mr-5">
            <div className="absolute inset-0 rounded-full bg-wuxia-red/10 blur-md" />
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-wuxia-red/30 bg-gradient-to-b from-[#2a1111] to-black sm:h-16 sm:w-16">
              <UserIcon className="h-5 w-5 text-wuxia-red/60 sm:h-6 sm:w-6" />
            </div>
          </div>
          <div className="w-full flex-grow pr-8">
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="mb-1 truncate font-serif text-lg tracking-[0.14em] text-white sm:text-xl">{npc.name}</h4>
                <p className="text-sm tracking-[0.14em] text-wuxia-gold">{npc.identity}</p>
              </div>
              <div className="flex gap-3 text-sm text-gray-400 sm:flex-col sm:items-end sm:gap-1 sm:text-right">
                <span>{npc.gender}</span>
                <span>{npc.age > 0 ? `${npc.age} 岁` : '年龄未知'}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1.5 flex justify-between gap-3 text-xs sm:text-sm">
                <span className="flex items-center tracking-[0.16em] text-gray-300">
                  <UsersIcon className="mr-1.5 h-3.5 w-3.5 text-wuxia-red" />
                  好感度
                </span>
                <span className="font-mono text-wuxia-red">{npc.favorability} / 100</span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-black/80">
                <div className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-wuxia-red/40 via-wuxia-red/80 to-wuxia-red shadow-[0_0_8px_rgba(139,28,28,0.8)]" style={{ width: `${npc.favorability}%` }} />
              </div>
              <p className="mt-3 max-w-[42rem] text-xs italic leading-6 tracking-[0.16em] text-wuxia-gold/90 sm:text-sm">{getNpcRelationshipText(npc.favorability)}</p>
            </div>
            {pendingDeleteId === npc.id ? (
              <div className="mt-4 rounded-[0.9rem] border border-wuxia-red/30 bg-[#160f10]/92 p-3">
                <div className="text-[11px] tracking-[0.22em] text-wuxia-red/75">删除确认</div>
                <p className="mt-2 text-sm leading-6 text-gray-200">确认删除人物关系“{npc.name}”吗？此操作会同步清除变量。</p>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={onCancelDelete} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs tracking-[0.12em] text-gray-300 transition-colors hover:border-white/20 hover:text-white">取消</button>
                  <button type="button" onClick={onConfirmDelete} className="rounded-full border border-wuxia-red/40 bg-wuxia-red/15 px-3 py-1.5 text-xs tracking-[0.12em] text-white transition-colors hover:border-wuxia-red/60 hover:bg-wuxia-red/25">确认删除</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ))}
      {data.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center text-gray-500">
          <UsersIcon className="mb-4 h-12 w-12 opacity-20" />
          <p className="text-base tracking-[0.2em] sm:text-lg">当前没有可展示的人物关系</p>
        </div>
      ) : null}
    </div>
  );
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-white/5 text-gray-400 transition-all hover:border-wuxia-gold/50 hover:bg-wuxia-gold/20 hover:text-wuxia-gold sm:h-10 sm:w-10">
      {children}
    </button>
  );
}

function StatusBar({
  world,
  protagonist,
  inventoryCount,
  npcCount,
  onOpenModal,
}: {
  world: WorldState;
  protagonist: ProtagonistState;
  inventoryCount: number;
  npcCount: number;
  onOpenModal: (modal: Exclude<ActiveModal, null>) => void;
}) {
  return (
    <div className="relative z-40 w-full px-1.5 py-2 sm:px-3 sm:py-4">
      <div className="relative mx-auto w-full overflow-hidden rounded-[1.35rem] border border-wuxia-gold/20 bg-[#0a0a0c]/82 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(205,164,52,0.1)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(205,164,52,0.14),_transparent_58%)]" />
        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(0,15rem)_auto_minmax(0,1fr)_minmax(0,21rem)] sm:gap-3">
          <div className="flex min-w-0 items-center gap-2 rounded-full border border-white/6 bg-black/55 px-3 py-2.5 sm:px-4 sm:py-3">
            <MapPinIcon className="h-4 w-4 flex-none text-wuxia-gold" />
            <span className="min-w-0 truncate font-serif text-[0.78rem] tracking-[0.14em] text-wuxia-gold sm:text-base sm:tracking-[0.16em]">{world.location}</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/6 bg-black/55 px-3 py-2.5 sm:px-4 sm:py-3">
            <ClockIcon className="h-4 w-4 flex-none text-gray-300" />
            <span className="whitespace-nowrap font-mono text-[0.72rem] tracking-wide text-gray-200 sm:text-sm sm:tracking-wider">{world.time}</span>
          </div>
          <div className="col-span-2 min-w-0 rounded-[1rem] border border-wuxia-gold/40 bg-gradient-to-r from-wuxia-gold/10 via-wuxia-gold/20 to-wuxia-gold/10 px-3 py-3 shadow-[inset_0_0_20px_rgba(205,164,52,0.15)] sm:col-span-1 sm:rounded-[1.8rem] sm:px-5 sm:py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <ScrollIcon className="h-4 w-4 flex-none text-wuxia-gold sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <span className="mb-0.5 block text-[0.62rem] tracking-[0.22em] text-wuxia-gold/90 sm:text-xs">当前要务</span>
                <span className="block overflow-hidden font-serif text-[0.82rem] leading-[1.45] tracking-[0.03em] text-white sm:truncate sm:text-[1.15rem] sm:leading-normal sm:tracking-[0.08em]" style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>{world.task}</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 flex min-w-0 flex-col gap-2 rounded-[1rem] border border-white/6 bg-black/55 px-3 py-2.5 sm:col-span-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:rounded-full sm:px-4 sm:py-3">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-wuxia-gold/40 bg-gradient-to-br from-wuxia-gold/20 to-black shadow-[0_0_15px_rgba(205,164,52,0.2)] sm:h-11 sm:w-11">
                <UserIcon className="h-4 w-4 text-wuxia-gold sm:h-[18px] sm:w-[18px]" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-[0.66rem] tracking-[0.14em] text-wuxia-gold/90 sm:text-xs sm:tracking-[0.18em]">{protagonist.identity}</span>
                <span className="block truncate font-serif text-[1rem] tracking-[0.05em] text-white sm:text-[1.15rem] sm:tracking-[0.08em]">{protagonist.name}</span>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] tracking-[0.16em] text-gray-300">随身 {inventoryCount}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] tracking-[0.16em] text-gray-300">人脉 {npcCount}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-none items-center justify-end gap-1.5 sm:gap-2">
              <ActionButton label="主角生平" onClick={() => onOpenModal('protagonist')}><UserIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /></ActionButton>
              <ActionButton label="随身物品" onClick={() => onOpenModal('inventory')}><PackageIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /></ActionButton>
              <ActionButton label="人物关系" onClick={() => onOpenModal('npc')}><UsersIcon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" /></ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const { world, protagonist, inventory, npcs } = useWuxiaViewModel();
  const inventoryCount = useMemo(() => inventory.reduce((sum, item) => sum + Math.max(0, item.quantity), 0), [inventory]);
  const pendingInventoryDeleteId = pendingDelete?.type === 'inventory' ? pendingDelete.item.id : null;
  const pendingNpcDeleteId = pendingDelete?.type === 'npc' ? pendingDelete.npc.id : null;

  const handleDeleteInventory = (item: InventoryItem) => {
    setPendingDelete({ type: 'inventory', item });
  };

  const handleDeleteNpc = (npc: NPCState) => {
    setPendingDelete({ type: 'npc', npc });
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;

    if (pendingDelete.type === 'inventory') {
      const { item } = pendingDelete;
      setPendingDelete(null);
      setActiveModal('inventory');

      const ok = deleteInventoryFromVariables(item);
      if (ok) {
        notifySuccess(`已删除物品：${item.name}`);
        return;
      }
      notifyError(`删除物品失败：${item.name}`);
      return;
    }

    const { npc } = pendingDelete;
    setPendingDelete(null);
    setActiveModal('npc');

    const ok = deleteNpcFromVariables(npc);
    if (ok) {
      notifySuccess(`已删除人物关系：${npc.name}`);
      return;
    }
    notifyError(`删除人物关系失败：${npc.name}`);
  };

  const inventoryModalOpen = activeModal === 'inventory' || pendingDelete?.type === 'inventory';
  const npcModalOpen = activeModal === 'npc' || pendingDelete?.type === 'npc';

  const closeInventoryModal = () => {
    if (pendingDelete?.type === 'inventory') return;
    setActiveModal(null);
  };

  const closeNpcModal = () => {
    if (pendingDelete?.type === 'npc') return;
    setActiveModal(null);
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#050505] selection:bg-wuxia-gold/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(205,164,52,0.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(139,28,28,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/75 to-[#050505]" />
      <StatusBar world={world} protagonist={protagonist} inventoryCount={inventoryCount} npcCount={npcs.length} onOpenModal={setActiveModal} />
      <Modal isOpen={activeModal === 'protagonist'} onClose={() => setActiveModal(null)} title="主角生平"><ProtagonistContent data={protagonist} /></Modal>
      <Modal isOpen={inventoryModalOpen} onClose={closeInventoryModal} title="随身物品"><InventoryContent data={inventory} pendingDeleteId={pendingInventoryDeleteId} onDelete={handleDeleteInventory} onCancelDelete={cancelDelete} onConfirmDelete={confirmDelete} /></Modal>
      <Modal isOpen={npcModalOpen} onClose={closeNpcModal} title="人物关系"><NPCContent data={npcs} pendingDeleteId={pendingNpcDeleteId} onDelete={handleDeleteNpc} onCancelDelete={cancelDelete} onConfirmDelete={confirmDelete} /></Modal>
    </div>
  );
}
