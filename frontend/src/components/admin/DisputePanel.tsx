import { Scale } from "lucide-react";
import { EmptyState } from "../common/EmptyState";
import { Card, CardTitle } from "../ui/Card";

export function DisputePanel() {
  return (
    <Card>
      <CardTitle icon={<Scale className="h-4 w-4" />}>Disputes</CardTitle>
      <EmptyState icon={<Scale className="h-6 w-6" />} title="No active disputes" hint="Disputed escrows show up here for an arbiter to resolve." />
    </Card>
  );
}
