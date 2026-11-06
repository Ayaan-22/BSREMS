import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function DisputePanel() {
  return <Card><h2 className="mb-3 text-lg font-semibold">Disputes</h2><div className="flex items-center justify-between rounded bg-background p-3"><span>No active disputes</span><Button className="bg-white/10 text-white">Resolve</Button></div></Card>;
}
