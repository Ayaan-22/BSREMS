import { Button } from "../ui/Button";

export function RentalForm() {
  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5 text-xs text-muted">
        Monthly rent
        <div className="relative">
          <input className="field pr-14" placeholder="0.25" inputMode="decimal" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">ETH</span>
        </div>
      </label>
      <label className="grid gap-1.5 text-xs text-muted">
        Security deposit
        <div className="relative">
          <input className="field pr-14" placeholder="0.5" inputMode="decimal" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">ETH</span>
        </div>
      </label>
      <Button variant="secondary" className="mt-1">Create rental agreement</Button>
    </div>
  );
}
