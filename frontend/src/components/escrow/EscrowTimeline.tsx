const steps = ["Created", "Funded", "Buyer approved", "Seller approved", "Completed"];

export function EscrowTimeline() {
  return <div className="grid gap-2 sm:grid-cols-5">{steps.map((step) => <div key={step} className="rounded bg-white/5 p-3 text-sm text-slate-300">{step}</div>)}</div>;
}
