import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function IconBase({
  children,
  size = 20,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function AppleLogo(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={props.size ?? 20}
      viewBox="0 0 24 24"
      width={props.size ?? 20}
      {...props}
    >
      <path d="M17.8 13.1c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 6.9 1.2 9.1.8 1.1 1.7 2.3 2.9 2.3 1.2-.1 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.6 1.3-2.7-.1-.1-2.7-1-2.7-3.5Z" />
      <path d="M15.5 6.3c.7-.8 1.1-1.9 1-3.1-1 .1-2.1.6-2.8 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.2Z" />
    </svg>
  );
}

export function AndroidLogo(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 9h10a2 2 0 0 1 2 2v6.5H5V11a2 2 0 0 1 2-2Z" />
      <path d="m8.2 5.2-1.4-2M15.8 5.2l1.4-2" />
      <path d="M8 9a4 4 0 0 1 8 0" />
      <path d="M8.8 12.4h.01M15.2 12.4h.01" />
      <path d="M5 12H3.5v4H5M19 12h1.5v4H19M8 17.5v3M16 17.5v3" />
    </IconBase>
  );
}

export function Activity(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h4l2.5-7 5 14 2.5-7h4" />
    </IconBase>
  );
}

export function Building2(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M4 22h16" />
      <path d="M10 6h4M10 10h4M10 14h4" />
    </IconBase>
  );
}

export function CheckCircle2(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.6 2.6L16 9" />
    </IconBase>
  );
}

export function CalendarDays(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 2v4M16 2v4" />
      <rect height="18" rx="2" width="18" x="3" y="4" />
      <path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </IconBase>
  );
}

export function Database(props: IconProps) {
  return (
    <IconBase {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </IconBase>
  );
}

export function Download(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </IconBase>
  );
}

export function ExternalLink(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </IconBase>
  );
}

export function Headphones(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5Z" />
      <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" />
    </IconBase>
  );
}

export function HelpCircle(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 1 1 5.3 2c-.9.8-1.4 1.2-1.4 2.5" />
      <path d="M12 17h.01" />
    </IconBase>
  );
}

export function LockKeyhole(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="11" rx="2" width="16" x="4" y="11" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 15.5v2" />
    </IconBase>
  );
}

export function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="16" rx="2" width="20" x="2" y="4" />
      <path d="m22 7-10 7L2 7" />
    </IconBase>
  );
}

export function FileText(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h5" />
    </IconBase>
  );
}

export function Search(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

export function Globe2(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
    </IconBase>
  );
}

export function Monitor(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="14" rx="2" width="20" x="2" y="3" />
      <path d="M8 21h8M12 17v4" />
    </IconBase>
  );
}

export function WindowsLogo(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height={props.size ?? 20}
      viewBox="0 0 24 24"
      width={props.size ?? 20}
      {...props}
    >
      <path d="M3 5.6 10.4 4.5v6.6H3V5.6ZM11.6 4.3 21 3v8.1h-9.4V4.3ZM3 12.4h7.4v6.9L3 18.2v-5.8ZM11.6 12.4H21V21l-9.4-1.4v-7.2Z" />
    </svg>
  );
}

export function UserRound(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </IconBase>
  );
}

export function Server(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="8" rx="2" width="20" x="2" y="2" />
      <rect height="8" rx="2" width="20" x="2" y="14" />
      <path d="M6 6h.01M6 18h.01" />
    </IconBase>
  );
}

export function ShieldCheck(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}

export function Smartphone(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect height="20" rx="2" width="14" x="5" y="2" />
      <path d="M12 18h.01" />
    </IconBase>
  );
}
