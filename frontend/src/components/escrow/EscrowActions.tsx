import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export function EscrowActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>
        <CheckCircle2 className="h-4 w-4" /> Approve deal
      </Button>
      <Button variant="danger">
        <AlertTriangle className="h-4 w-4" /> Raise dispute
      </Button>
    </div>
  );
}
