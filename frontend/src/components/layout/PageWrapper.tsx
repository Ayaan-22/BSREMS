import { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
