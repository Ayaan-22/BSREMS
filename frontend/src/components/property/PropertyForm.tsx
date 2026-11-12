import { ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Fuel, ImagePlus, PenLine, Rocket, UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

const STEPS = [
  { icon: PenLine, label: "Details" },
  { icon: ImagePlus, label: "Photos" },
  { icon: FileText, label: "Documents" },
  { icon: Rocket, label: "Review" }
];

export function PropertyForm() {
  const [step, setStep] = useState(1);

  return (
    <div className="glass ring-gradient overflow-hidden rounded-3xl">
      {/* Stepper */}
      <div className="border-b border-white/[.06] bg-white/[.015] px-6 py-6 md:px-8">
        <ol className="relative grid grid-cols-4">
          <div className="absolute left-[12.5%] right-[12.5%] top-5 h-px bg-white/10" />
          <div className="absolute left-[12.5%] top-5 h-px bg-gradient-to-r from-accent to-gold transition-all duration-700" style={{ width: `${((step - 1) / 3) * 75}%` }} />
          {STEPS.map(({ icon: Icon, label }, index) => {
            const n = index + 1;
            const done = n < step;
            const current = n === step;
            return (
              <li key={label} className="relative flex flex-col items-center gap-2.5">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full border transition-all duration-500",
                    done && "border-accent bg-accent text-ink-950",
                    current && "border-accent bg-ink-900 text-accent-soft shadow-glow",
                    !done && !current && "border-white/10 bg-ink-900 text-slate-500"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </span>
                <span className={cn("text-xs font-medium", current ? "text-white" : "text-muted")}>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div key={step} className="animate-fade-up p-6 md:p-8">
        {step === 1 && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title" className="md:col-span-2">
              <input className="field" placeholder="Glass house on the ridge" />
            </Field>
            <Field label="Price">
              <div className="relative">
                <input className="field pr-14" placeholder="2.5" inputMode="decimal" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-muted">ETH</span>
              </div>
            </Field>
            <Field label="City">
              <input className="field" placeholder="Lisbon" />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea className="field min-h-32 resize-y" placeholder="Light, materials, neighbourhood, what makes it special…" />
            </Field>
          </div>
        )}
        {step === 2 && (
          <Dropzone icon={<UploadCloud className="h-7 w-7" />} title="Drop photos here" hint="JPG or PNG. Each image is pinned to IPFS and referenced in the listing metadata." />
        )}
        {step === 3 && (
          <Dropzone icon={<FileText className="h-7 w-7" />} title="Title deed & inspection PDFs" hint="Optional, but verifiers need them before the listing gets a verified badge." />
        )}
        {step === 4 && (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Metadata", "Pinned to IPFS", FileText],
              ["Contract", "PropertyRegistry.listProperty", Rocket],
              ["Estimated gas", "Calculated on submit", Fuel]
            ].map(([label, value, Icon]) => {
              const I = Icon as typeof Fuel;
              return (
                <div key={label as string} className="rounded-2xl border border-white/[.07] bg-white/[.02] p-5">
                  <I className="h-5 w-5 text-accent-soft" />
                  <p className="mt-4 text-xs text-muted">{label as string}</p>
                  <p className="mt-1 font-mono text-sm text-white">{value as string}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/[.06] px-6 py-5 md:px-8">
        <Button variant="ghost" disabled={step === 1} onClick={() => setStep((value) => value - 1)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <span className="font-mono text-xs text-muted">Step {step} / 4</span>
        <Button variant={step === 4 ? "gold" : "primary"} onClick={() => (step < 4 ? setStep((value) => value + 1) : undefined)}>
          {step < 4 ? (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4" /> Submit to blockchain
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={cn("grid gap-2 text-xs font-medium text-slate-400", className)}>
      {label}
      {children}
    </label>
  );
}

function Dropzone({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) {
  return (
    <div className="group relative grid min-h-64 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[.015] p-8 text-center transition-all hover:border-accent/50 hover:bg-accent/[.04]">
      <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(circle_at_center,#000,transparent_70%)]" />
      <div className="relative">
        <span className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-accent-soft transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-glow">
          {icon}
        </span>
        <p className="font-semibold text-white">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">{hint}</p>
      </div>
    </div>
  );
}
