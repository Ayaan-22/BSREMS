import { Link, NavLink } from "react-router-dom";
import { Building2 } from "lucide-react";
import { ConnectWallet } from "../wallet/ConnectWallet";

const links = [
  ["Browse", "/browse"],
  ["List", "/list"],
  ["Dashboard", "/dashboard"],
  ["Escrow", "/escrow"],
  ["Admin", "/admin"]
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Building2 className="h-6 w-6 text-accent" />
          BSREMS Pro
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "text-accent" : "text-slate-300 hover:text-white")}>
              {label}
            </NavLink>
          ))}
        </nav>
        <ConnectWallet />
      </div>
    </header>
  );
}
