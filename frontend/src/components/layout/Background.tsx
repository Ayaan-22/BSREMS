/** Fixed ambient backdrop: drifting aurora, a faint grid and film grain. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-900">
      <div className="absolute -left-[20%] -top-[30%] h-[80vh] w-[80vh] animate-aurora rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute -right-[15%] top-[10%] h-[70vh] w-[70vh] animate-aurora-slow rounded-full bg-iris/[.16] blur-[130px]" />
      <div className="absolute bottom-[-30%] left-[30%] h-[70vh] w-[70vh] animate-aurora rounded-full bg-gold/[.09] blur-[140px] [animation-delay:-8s]" />
      <div className="absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,#000_10%,transparent_65%)]" />
      <div className="absolute inset-0 noise opacity-[.06] mix-blend-overlay" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </div>
  );
}
