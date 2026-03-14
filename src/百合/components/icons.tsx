import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  children: ReactNode;
};

function IconBase({ size = 16, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function User(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </IconBase>
  );
}

export function Target(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3" />
      <path d="M12 19v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </IconBase>
  );
}

export function Clock(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </IconBase>
  );
}

export function ShieldAlert(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </IconBase>
  );
}

export function Zap(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </IconBase>
  );
}

export function Brain(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M9.5 4a3 3 0 0 0-3 3v.5A2.5 2.5 0 0 0 4 10v1a2.5 2.5 0 0 0 1.5 2.3V15a3 3 0 0 0 3 3" />
      <path d="M14.5 4a3 3 0 0 1 3 3v.5A2.5 2.5 0 0 1 20 10v1a2.5 2.5 0 0 1-1.5 2.3V15a3 3 0 0 1-3 3" />
      <path d="M9.5 4C8 4 7 5.2 7 6.7V9" />
      <path d="M14.5 4C16 4 17 5.2 17 6.7V9" />
      <path d="M12 6v12" />
      <path d="M9 11h6" />
    </IconBase>
  );
}

export function Heart(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    </IconBase>
  );
}

export function Activity(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2-5 4 10 2-5h6" />
    </IconBase>
  );
}

export function Sparkles(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M5 16l.8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16z" />
      <path d="M19 13l.8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13z" />
    </IconBase>
  );
}

export function Crosshair(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
    </IconBase>
  );
}

export function Flame(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M12 3s4 3.5 4 8a4 4 0 1 1-8 0c0-2.5 1.2-4.3 2.8-6.2.5 2.2 1.8 3.4 1.8 3.4S13.7 6 12 3z" />
    </IconBase>
  );
}

export function Shield(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
    </IconBase>
  );
}

export function Lock(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </IconBase>
  );
}

export function Eye(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="2.5" />
    </IconBase>
  );
}

export function Droplets(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M8 6s-3 3.4-3 6.3A3 3 0 0 0 8 15a3 3 0 0 0 3-2.7C11 9.4 8 6 8 6z" />
      <path d="M16 3s-4 4.5-4 8.3A4 4 0 0 0 16 15a4 4 0 0 0 4-3.7C20 7.5 16 3 16 3z" />
    </IconBase>
  );
}

export function Send(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <path d="M3 11.5L21 3l-5.5 18-3.5-7-8.5-2.5z" />
    </IconBase>
  );
}

export function Image(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M21 16l-5-5-7 7" />
    </IconBase>
  );
}

export function Settings(props: Omit<IconProps, 'children'>) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.4.6z" />
    </IconBase>
  );
}
