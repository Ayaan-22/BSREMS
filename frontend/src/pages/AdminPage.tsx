import { AdminDashboard } from "../components/admin/AdminDashboard";
import { DisputePanel } from "../components/admin/DisputePanel";
import { VerificationQueue } from "../components/admin/VerificationQueue";
import { PageHeader } from "../components/layout/PageWrapper";

export function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Operations" title={<>Admin <em className="text-gradient">console</em></>} description="Verify listings, resolve disputes and watch the platform in real time." />
      <AdminDashboard />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <VerificationQueue />
        <DisputePanel />
      </div>
    </div>
  );
}
