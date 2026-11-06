import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function VerificationQueue() {
  return <Card><h2 className="mb-3 text-lg font-semibold">Verification Queue</h2><div className="flex items-center justify-between rounded bg-background p-3"><span>Pending IPFS listing</span><Button>Verify</Button></div></Card>;
}
