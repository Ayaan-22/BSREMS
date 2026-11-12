import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Background } from "./Background";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function PageWrapper({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="relative min-h-screen text-slate-50">
      <Background />
      <Navbar />
      <main key={pathname} className="mx-auto max-w-7xl animate-fade-up px-4 pb-10 pt-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: ReactNode; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-4"><span className="h-px w-6 bg-accent-soft/60" />{eyebrow}</p>}
        <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-white md:text-6xl">{title}</h1>
        {description && <p className="mt-4 text-base leading-relaxed text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
