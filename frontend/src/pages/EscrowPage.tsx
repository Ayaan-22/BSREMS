import { Clock3, Lock, Scale, ShieldCheck } from "lucide-react";
import { EscrowActions } from "../components/escrow/EscrowActions";
import { EscrowTimeline } from "../components/escrow/EscrowTimeline";
import { PageHeader } from "../components/layout/PageWrapper";
import { Card, CardTitle } from "../components/ui/Card";

const guarantees = [
  { icon: Lock, title: "Funds locked", body: "The purchase price sits in EscrowManager — neither side can move it alone." },
  { icon: Clock3, title: "Deadlines enforced", body: "If approvals miss the deadline, the buyer can reclaim funds." },
  { icon: Scale, title: "Arbitration", body: "Either party can raise a dispute for an arbiter role to resolve on-chain." }
];

export function EscrowPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settlement"
        title={
          <>
            Escrow, <em className="text-gradient">without the middleman</em>
          </>
        }
        description="Track a deal from funding to deed transfer. Each stage is a contract call anyone can verify."
      />

      <Card glow className="!bg-ink-800/70 md:p-8">
        <CardTitle icon={<ShieldCheck className="h-4 w-4" />} action={<span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] text-muted">No escrow selected</span>}>
          Deal progress
        </CardTitle>
        <EscrowTimeline current={0} />
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.06] pt-6">
          <p className="max-w-md text-sm text-muted">Open an escrow from a listing’s “Buy with escrow” button. Actions here apply to the selected deal.</p>
          <EscrowActions />
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-3">
        {guarantees.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-5 font-semibold text-white">{title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
