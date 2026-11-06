import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "../ui/Button";

export function PropertyForm() {
  const [step, setStep] = useState(1);
  return (
    <div className="space-y-4 rounded border border-white/10 bg-surface p-4">
      <div className="flex gap-2 text-sm text-muted">Step {step} of 4</div>
      {step === 1 && <div className="grid gap-3 md:grid-cols-2"><input className="rounded bg-background p-3" placeholder="Title" /><input className="rounded bg-background p-3" placeholder="Price ETH" /><textarea className="rounded bg-background p-3 md:col-span-2" placeholder="Description" /></div>}
      {step === 2 && <div className="rounded border border-dashed border-white/20 p-8 text-center"><UploadCloud className="mx-auto mb-3 text-accent" />Drag images here</div>}
      {step === 3 && <div className="rounded border border-dashed border-white/20 p-8 text-center">Optional title deed and inspection PDFs</div>}
      {step === 4 && <div className="rounded bg-background p-4">Review listing, estimate gas, and submit to blockchain.</div>}
      <div className="flex justify-between">
        <Button className="bg-white/10 text-white" disabled={step === 1} onClick={() => setStep((value) => value - 1)}>Back</Button>
        <Button onClick={() => (step < 4 ? setStep((value) => value + 1) : undefined)}>{step < 4 ? "Next" : "Submit to Blockchain"}</Button>
      </div>
    </div>
  );
}
