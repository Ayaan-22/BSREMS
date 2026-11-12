import { Link } from "react-router-dom";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5EEAD4" />
          <stop offset=".55" stopColor="#A5F3FC" />
          <stop offset="1" stopColor="#F2C46D" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="12" fill="#0D1017" stroke="url(#logo-g)" strokeOpacity=".5" />
      <path d="M11 29V17.5L20 10l9 7.5V29h-6v-7h-6v7z" fill="url(#logo-g)" />
      <circle cx="20" cy="16.5" r="1.8" fill="#07080C" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="focus-ring group flex items-center gap-3 rounded-xl">
      <span className="transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105">
        <LogoMark />
      </span>
      <span className="leading-none">
        <span className="block text-[15px] font-bold tracking-tight text-white">BSREMS</span>
        <span className="mt-0.5 block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-accent-soft sm:tracking-[0.3em]">Pro · On-chain</span>
      </span>
    </Link>
  );
}
