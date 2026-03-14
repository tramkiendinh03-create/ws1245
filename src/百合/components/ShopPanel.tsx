import { useState } from 'react';
import _ from 'lodash';
import { Flame, Sparkles, Zap } from './icons';
import { toDisplayNumber, toDisplayString, updateMessageVariables, useStatData } from '../statData';

const SHOP_PATHS = ['商城', '系统商城', '兑换商城', '主控面板.商城', '主角面板.商城'] as const;
const INVENTORY_PATHS = [
  '物品栏',
  '主控面板.物品栏',
  '主角面板.物品栏',
  '主控面板.数值与养成.物品栏',
  '主角面板.数值与养成.物品栏',
] as const;
const STRATEGY_POINT_PATHS = [
  '主控面板.数值与养成.攻略点数',
  '主控面板.攻略点数',
  '主角面板.数值与养成.攻略点数',
  '主角面板.攻略点数',
  '攻略点数',
] as const;

const SHOP_ITEM_ACCENTS = [
  'from-pink-500/22 via-fuchsia-500/12 to-transparent border-pink-400/25 text-pink-100',
  'from-fuchsia-500/20 via-rose-500/12 to-transparent border-fuchsia-400/24 text-fuchsia-100',
  'from-rose-500/18 via-pink-500/12 to-transparent border-rose-400/24 text-rose-100',
] as const;

type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number | null;
  stockPath?: string;
  itemDescription: string;
  accent: string;
};

type ShopViewModel = {
  strategyPoints: number;
  items: ShopItem[];
  sourcePath?: string;
  isBuiltIn: boolean;
};

const BUILT_IN_SHOP_ITEMS: Omit<ShopItem, 'accent'>[] = [
  {
    id: 'builtin-lip-gloss',
    name: '蜜桃封唇蜜',
    description: '甜熟果香会黏在唇齿和衣领边缘，让一次普通的靠近都像故意拖长的挑逗，适合给主角的百合度开一个过分柔软的口子。',
    price: 18,
    stock: null,
    itemDescription: '带着甜熟果香的蜜桃封唇蜜。',
  },
  {
    id: 'builtin-ribbon',
    name: '暧昧束发丝带',
    description: '浅粉丝带看起来无害，系上时却会把视线、手指停留和不该有的怜爱都放大一点，适合慢慢把对方的百合度往上引。',
    price: 22,
    stock: null,
    itemDescription: '一条残留着体温与香气的暧昧束发丝带。',
  },
  {
    id: 'builtin-choker',
    name: '驯顺颈圈',
    description: '柔软皮带贴住颈侧时会留下很轻的存在感，像一句没说出口的命令，尤其适合支配意味和服从暗示渐渐失控的桥段。',
    price: 28,
    stock: null,
    itemDescription: '一只带细银扣的驯顺颈圈。',
  },
  {
    id: 'builtin-perfume',
    name: '夜巡留香喷雾',
    description: '喷在领口和手腕后，走廊里每一次擦肩都会残留一点过界的甜香，像把主角的百合度悄悄腌进夜色里。',
    price: 32,
    stock: null,
    itemDescription: '专门留在袖口与锁骨附近的夜巡留香喷雾。',
  },
  {
    id: 'builtin-stockings',
    name: '黑纱腿环',
    description: '细窄黑纱勒出一点克制过头的暧昧感，不会直白，却会让对方的视线停得久到不该，适合攻略时制造静悄悄的失守。',
    price: 36,
    stock: null,
    itemDescription: '一对缀着暗银吊饰的黑纱腿环。',
  },
  {
    id: 'builtin-photo',
    name: '私藏拍立得',
    description: '能把视线失控、呼吸发乱和不肯承认的脸红都定格下来，像一张专门用来拿捏她心虚的把柄。',
    price: 42,
    stock: null,
    itemDescription: '一组只适合贴身收藏的私藏拍立得。',
  },
  {
    id: 'builtin-script',
    name: '服从调教提词卡',
    description: '上面写着温柔到近乎恶劣的引导句，适合一点点教主角习惯羞耻、习惯沉迷、也习惯在她面前失去拒绝的力气。',
    price: 48,
    stock: null,
    itemDescription: '一叠写满暧昧命令与诱导台词的提词卡。',
  },
  {
    id: 'builtin-collar-bell',
    name: '心锁铃铛项圈',
    description: '铃声细得发痒，轻轻一晃就像把顺从和占有都挂在喉口，特别适合高价换来的黑化式亲密推进。',
    price: 56,
    stock: null,
    itemDescription: '一只缀着细铃的心锁项圈。',
  },
  {
    id: 'builtin-discipline-gloves',
    name: '风纪白手套',
    description: '雪白皮面会把每一次触碰都衬得过分克制，也因此更像压着分寸线的试探，适合攻略冷感和风纪系角色。',
    price: 62,
    stock: null,
    itemDescription: '一双带着冷香的风纪白手套。',
  },
  {
    id: 'builtin-detention-note',
    name: '放课后留堂通知',
    description: '看似正经的纸页其实是单独相处的邀请函，最适合把对方的警惕、心跳和不该有的依赖一并关进黄昏教室里。',
    price: 68,
    stock: null,
    itemDescription: '一张写着暧昧时间地点的留堂通知。',
  },
  {
    id: 'builtin-confession-recorder',
    name: '耳语录音笔',
    description: '能留下呼吸发软、尾音失守和说出口又想收回的话，越是高傲的人，越容易被这种证据慢慢磨低防线。',
    price: 76,
    stock: null,
    itemDescription: '一支专门收藏私密耳语的录音笔。',
  },
  {
    id: 'builtin-black-contract',
    name: '共犯契约书',
    description: '签下去像玩笑，收起来却像把彼此的秘密一起攥在手心里，特别适合后期推进主角堕落和双向百合度失控。',
    price: 88,
    stock: null,
    itemDescription: '一份写满亲密约束与秘密条款的共犯契约书。',
  },
] as const;

const FALLBACK_SHOP: ShopViewModel = {
  strategyPoints: 0,
  items: BUILT_IN_SHOP_ITEMS.map((item, index) => ({
    ...item,
    accent: SHOP_ITEM_ACCENTS[index % SHOP_ITEM_ACCENTS.length],
  })),
  isBuiltIn: true,
};

function resolveExistingPath(statData: Record<string, any>, paths: readonly string[]): string | null {
  return paths.find(path => _.has(statData, path)) ?? null;
}

function buildShopItems(rawShop: unknown, sourcePath: string): ShopItem[] {
  const normalizeObjectItem = (
    itemKey: string,
    itemValue: Record<string, unknown>,
    itemPath: string,
    index: number,
  ): ShopItem | null => {
    const name = toDisplayString(_.get(itemValue, '名称') ?? _.get(itemValue, '名字') ?? itemKey, '').trim();
    const price = toDisplayNumber(
      _.get(itemValue, '价格') ?? _.get(itemValue, '消耗') ?? _.get(itemValue, '点数') ?? _.get(itemValue, '攻略点数'),
      NaN,
    );
    if (!name || !Number.isFinite(price) || price <= 0) return null;

    const description = toDisplayString(
      _.get(itemValue, '描述') ?? _.get(itemValue, '说明') ?? _.get(itemValue, '效果') ?? _.get(itemValue, '备注'),
      '可在剧情内兑换使用。',
    );
    const stockPath = _.has(itemValue, '库存')
      ? `${itemPath}.库存`
      : _.has(itemValue, '数量')
        ? `${itemPath}.数量`
        : _.has(itemValue, '剩余')
          ? `${itemPath}.剩余`
          : undefined;
    const stock = stockPath ? toDisplayNumber(_.get(itemValue, stockPath.split('.').slice(-1)[0]), 0) : null;

    return {
      id: `${itemPath}-${index}`,
      name,
      description,
      price,
      stock,
      stockPath,
      itemDescription: description,
      accent: SHOP_ITEM_ACCENTS[index % SHOP_ITEM_ACCENTS.length],
    };
  };

  if (_.isArray(rawShop)) {
    return rawShop
      .map((entry, index) => {
        if (_.isString(entry)) return null;
        if (!_.isObject(entry)) return null;
        return normalizeObjectItem(`item-${index + 1}`, entry as Record<string, unknown>, `${sourcePath}.${index}`, index);
      })
      .filter((item): item is ShopItem => item !== null);
  }

  if (_.isObject(rawShop)) {
    return Object.entries(rawShop as Record<string, unknown>)
      .map(([key, value], index) => {
        if (_.isString(value)) {
          const price = toDisplayNumber(value, NaN);
          if (!Number.isFinite(price) || price <= 0) return null;
          return {
            id: `${sourcePath}.${key}`,
            name: key,
            description: '可在剧情内兑换使用。',
            price,
            stock: null,
            itemDescription: '可在剧情内兑换使用。',
            accent: SHOP_ITEM_ACCENTS[index % SHOP_ITEM_ACCENTS.length],
          } satisfies ShopItem;
        }

        if (!_.isObject(value)) return null;
        return normalizeObjectItem(key, value as Record<string, unknown>, `${sourcePath}.${key}`, index);
      })
      .filter((item): item is ShopItem => item !== null);
  }

  return [];
}

function buildShopModel(statData: Record<string, any>): ShopViewModel {
  if (!_.isObject(statData)) return FALLBACK_SHOP;

  const sourcePath = resolveExistingPath(statData, SHOP_PATHS);
  const shopValue = sourcePath ? _.get(statData, sourcePath) : null;
  const strategyPath = resolveExistingPath(statData, STRATEGY_POINT_PATHS) ?? '攻略点数';
  const items = sourcePath ? buildShopItems(shopValue, sourcePath) : FALLBACK_SHOP.items;

  return {
    strategyPoints: toDisplayNumber(_.get(statData, strategyPath), 0),
    sourcePath: sourcePath ?? undefined,
    items,
    isBuiltIn: !sourcePath,
  };
}

function addItemToInventory(statData: Record<string, any>, item: ShopItem) {
  const inventoryPath = resolveExistingPath(statData, INVENTORY_PATHS) ?? '物品栏';
  const inventory = _.get(statData, inventoryPath);

  if (_.isArray(inventory)) {
    inventory.push(item.name);
    return;
  }

  if (_.isString(inventory)) {
    const items = inventory
      .split(/[、,，/|]+/)
      .map(value => value.trim())
      .filter(Boolean);
    items.push(item.name);
    _.set(statData, inventoryPath, items.join(' / '));
    return;
  }

  if (_.isObject(inventory) && !_.isArray(inventory)) {
    const current = _.get(statData, `${inventoryPath}.${item.name}`);
    if (_.isObject(current) && !_.isArray(current)) {
      const quantity = toDisplayNumber(_.get(current, '数量'), 0) + 1;
      _.set(statData, `${inventoryPath}.${item.name}.数量`, quantity);
      if (!_.has(current, '描述') && item.itemDescription) {
        _.set(statData, `${inventoryPath}.${item.name}.描述`, item.itemDescription);
      }
      return;
    }

    if (_.isNumber(current)) {
      _.set(statData, `${inventoryPath}.${item.name}`, current + 1);
      return;
    }

    _.set(statData, `${inventoryPath}.${item.name}`, {
      描述: item.itemDescription,
      数量: 1,
    });
    return;
  }

  _.set(statData, inventoryPath, {
    [item.name]: {
      描述: item.itemDescription,
      数量: 1,
    },
  });
}

export function ShopContent() {
  const model = useStatData(buildShopModel);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const buyItem = (item: ShopItem) => {
    if (pendingId || model.strategyPoints < item.price) return;
    if (item.stock !== null && item.stock <= 0) return;

    setPendingId(item.id);

    const updated = updateMessageVariables(variables => {
      const statData = _.get(variables, 'stat_data');
      if (!_.isObject(statData)) return;

      const strategyPath = resolveExistingPath(statData, STRATEGY_POINT_PATHS) ?? '攻略点数';
      const currentPoints = toDisplayNumber(_.get(statData, strategyPath), 0);
      if (currentPoints < item.price) return;

      if (item.stockPath) {
        const currentStock = toDisplayNumber(_.get(statData, item.stockPath), 0);
        if (currentStock <= 0) return;
        _.set(statData, item.stockPath, currentStock - 1);
      }

      _.set(statData, strategyPath, currentPoints - item.price);
      addItemToInventory(statData, item);
    });

    window.setTimeout(() => setPendingId(null), updated ? 240 : 0);
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 pb-3 sm:pb-4">
      <div className="bg-[#0a0005]/80 backdrop-blur-xl border border-pink-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,114,182,0.18),transparent_42%)] pointer-events-none" />
        <div className="absolute -right-10 top-2 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] tracking-[0.32em] text-pink-200/45">PRIVATE EXCHANGE</div>
            <h3 className="mt-1 text-base sm:text-lg font-semibold text-pink-50">剧情商城</h3>
            <p className="mt-1 text-xs text-pink-100/60">
              {model.isBuiltIn ? '当前显示的是内置调教道具；兑换后会直接写进物品栏。' : '使用攻略点数兑换暧昧道具，结果会同步写入物品栏。'}
            </p>
          </div>
          <div className="rounded-full border border-pink-300/20 bg-black/20 px-3 py-1.5 text-right shadow-[0_0_14px_rgba(244,114,182,0.12)]">
            <div className="text-[10px] tracking-[0.26em] text-pink-200/40">CREDIT</div>
            <div className="text-lg font-mono font-bold text-pink-100">{model.strategyPoints.toLocaleString('zh-CN')}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-2.5 sm:gap-3">
        {model.items.map(item => {
          const soldOut = item.stock !== null && item.stock <= 0;
          const disabled = !!pendingId || soldOut || model.strategyPoints < item.price;

          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl border bg-[linear-gradient(135deg,rgba(10,0,6,0.92),rgba(28,2,18,0.9)_52%,rgba(61,7,41,0.76))] p-3 shadow-[0_0_18px_rgba(236,72,153,0.08)] ${item.accent}`}
            >
              <div className="pointer-events-none absolute inset-[1px] rounded-[11px] border border-white/6" />
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-fuchsia-500 to-transparent" />
              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pink-200/20 bg-pink-500/10 text-pink-100">
                      <Sparkles size={14} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-pink-50">{item.name}</div>
                      <div className="mt-0.5 text-[10px] tracking-[0.24em] text-pink-100/34">SHOP ITEM</div>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] leading-6 text-pink-100/72">{item.description}</p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-full border border-pink-300/16 bg-black/20 px-2 py-1 text-pink-100/78">
                      <Zap size={12} /> {item.price} 点
                    </span>
                    {item.stock !== null ? (
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 ${soldOut ? 'border-red-300/20 bg-red-500/8 text-red-200/70' : 'border-fuchsia-300/16 bg-black/20 text-fuchsia-100/72'}`}>
                        <Flame size={12} /> 库存 {Math.max(0, item.stock)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-300/16 bg-black/20 px-2 py-1 text-fuchsia-100/72">
                        <Flame size={12} /> 常驻
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => buyItem(item)}
                  disabled={disabled}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                    disabled
                      ? 'cursor-not-allowed border-white/10 bg-white/5 text-white/30'
                      : 'border-pink-200/24 bg-pink-500/14 text-pink-50 hover:border-pink-100/55 hover:bg-pink-500/22 hover:shadow-[0_0_14px_rgba(244,114,182,0.22)]'
                  }`}
                >
                  {soldOut ? '售罄' : pendingId === item.id ? '兑换中' : '兑换'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
