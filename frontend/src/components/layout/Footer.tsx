import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const columns: Array<[string, Array<[string, string]>]> = [
  ["Marketplace", [["Browse listings", "/browse"], ["List a property", "/list"], ["Escrow", "/escrow"]]],
  ["Account", [["Dashboard", "/dashboard"], ["Admin console", "/admin"]]]
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Property listings, sale escrow, rentals and ERC-721 deeds — every step recorded on-chain and verifiable by anyone.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">Prototype · synthetic records · not financial advice</p>
        </div>
        {columns.map(([title, items]) => (
          <div key={title}>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">{title}</p>
            <ul className="space-y-2.5">
              {items.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-300 transition hover:text-accent-soft">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="overflow-hidden">
        <p className="select-none whitespace-nowrap text-center font-display text-[18vw] leading-[.8] tracking-tight text-white/[.03]">BSREMS Pro</p>
      </div>
    </footer>
  );
}
