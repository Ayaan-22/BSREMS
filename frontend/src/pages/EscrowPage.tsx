import { EscrowActions } from "../components/escrow/EscrowActions";
import { EscrowTimeline } from "../components/escrow/EscrowTimeline";
import { Card } from "../components/ui/Card";

export function EscrowPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Escrow Management</h1><Card><EscrowTimeline /><div className="mt-4"><EscrowActions /></div></Card></div>;
}
