import { Button } from "../ui/Button";

export function EscrowActions() {
  return <div className="flex flex-wrap gap-3"><Button>Approve Deal</Button><Button className="bg-warning text-background">Raise Dispute</Button></div>;
}
