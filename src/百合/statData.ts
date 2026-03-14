import _ from 'lodash';
import { useEffect, useState } from 'react';

type TavernHelperLike = {
  getVariables?: (option: { type: 'message'; message_id?: number | 'latest' }) => Record<string, any>;
  replaceVariables?: (
    variables: Record<string, any>,
    option: { type: 'message'; message_id?: number | 'latest' },
  ) => void;
};

export function toDisplayString(value: unknown, fallback = ''): string {
  if (_.isString(value)) {
    const text = value.trim();
    return text || fallback;
  }
  if (_.isNumber(value)) return String(value);
  return fallback;
}

export function toDisplayNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function createFallbackAvatar(label: string, theme: 'pink' | 'purple' = 'pink'): string {
  const safeLabel = (label || '?').trim().slice(0, 2) || '?';
  const palette =
    theme === 'purple'
      ? {
          primary: '#c084fc',
          secondary: '#f472b6',
          glow: 'rgba(192,132,252,0.38)',
          stroke: '#f5d0fe',
        }
      : {
          primary: '#fb7185',
          secondary: '#ec4899',
          glow: 'rgba(244,114,182,0.38)',
          stroke: '#fecdd3',
        };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.primary}"/>
          <stop offset="100%" stop-color="${palette.secondary}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stop-color="${palette.glow}"/>
          <stop offset="100%" stop-color="rgba(10,0,5,0)"/>
        </radialGradient>
      </defs>
      <rect width="160" height="160" rx="80" fill="#12010a"/>
      <circle cx="80" cy="80" r="74" fill="url(#bg)" opacity="0.18"/>
      <circle cx="80" cy="80" r="64" fill="#16020c" stroke="${palette.stroke}" stroke-opacity="0.7" stroke-width="2"/>
      <circle cx="80" cy="80" r="54" fill="url(#glow)"/>
      <path d="M38 116c10-22 29-33 42-33s32 11 42 33" fill="none" stroke="${palette.stroke}" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round"/>
      <circle cx="80" cy="62" r="22" fill="none" stroke="${palette.stroke}" stroke-opacity="0.45" stroke-width="3"/>
      <text x="80" y="93" text-anchor="middle" dominant-baseline="middle" fill="${palette.stroke}" font-size="28" font-family="'Microsoft YaHei','Noto Sans SC',sans-serif" font-weight="700" letter-spacing="1">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getMessageVariablesSafe(): Record<string, any> {
  try {
    if (typeof getVariables === 'function') {
      return getVariables({ type: 'message' });
    }
  } catch {}

  try {
    return ((globalThis as { TavernHelper?: TavernHelperLike }).TavernHelper?.getVariables?.({ type: 'message' }) ?? {});
  } catch {
    return {};
  }
}

export function updateMessageVariables(updater: (variables: Record<string, any>) => void): boolean {
  try {
    if (typeof getVariables === 'function' && typeof replaceVariables === 'function') {
      const variables = _.cloneDeep(getVariables({ type: 'message' }) ?? {});
      updater(variables);
      replaceVariables(variables, { type: 'message' });
      return true;
    }
  } catch {}

  try {
    const helper = (globalThis as { TavernHelper?: TavernHelperLike }).TavernHelper;
    if (!helper?.getVariables || !helper?.replaceVariables) return false;

    const variables = _.cloneDeep(helper.getVariables({ type: 'message' }) ?? {});
    updater(variables);
    helper.replaceVariables(variables, { type: 'message' });
    return true;
  } catch {
    return false;
  }
}

export function getStatData(): Record<string, any> {
  const variables = getMessageVariablesSafe();
  const statData = _.get(variables, 'stat_data');
  return _.isObject(statData) ? statData : {};
}

export function useStatData<T>(selector: (statData: Record<string, any>) => T, interval = 400): T {
  const [value, setValue] = useState<T>(() => selector(getStatData()));

  useEffect(() => {
    let lastSnapshot = JSON.stringify(value);

    const sync = () => {
      const next = selector(getStatData());
      const snapshot = JSON.stringify(next);
      if (snapshot === lastSnapshot) return;
      lastSnapshot = snapshot;
      setValue(next);
    };

    sync();
    const timer = window.setInterval(sync, interval);
    return () => window.clearInterval(timer);
  }, [interval, selector]);

  return value;
}
