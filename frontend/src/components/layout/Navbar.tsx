import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { LiveBlock } from "../common/LiveBlock";
import { ConnectWallet } from "../wallet/ConnectWallet";
import { Logo } from "./Logo";

const links = [
  ["Browse", "/browse"],
  ["List", "/list"],
  ["Dashboard", "/dashboard"],
  ["Escrow", "/escrow"],
  ["Admin", "/admin"]
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-3 py-2.5 transition-all duration-500 sm:px-4",
          scrolled ? "glass !bg-ink-900/80 shadow-float" : "border border-transparent"
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 rounded-full border border-white/[.07] bg-white/[.03] p-1 lg:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isActive ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.12)]" : "text-slate-400 hover:text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LiveBlock className="hidden md:inline-flex" />
          <ConnectWallet />
          <button
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className={cn("mx-auto max-w-7xl overflow-hidden transition-all duration-500 lg:hidden", open ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <nav className="glass grid gap-1 rounded-2xl p-2">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => cn("rounded-xl px-4 py-3 text-sm font-medium", isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5")}
            >
              {label}
            </NavLink>
          ))}
          <LiveBlock className="m-2 w-fit md:hidden" />
        </nav>
      </div>
    </header>
  );
}
