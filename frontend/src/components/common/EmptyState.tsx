import { Home } from "lucide-react";

export function EmptyState({ title = "No records yet" }: { title?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded border border-dashed border-white/15 text-muted">
      <Home className="mb-3 h-8 w-8 text-accent" />
      <p>{title}</p>
    </div>
  );
}
