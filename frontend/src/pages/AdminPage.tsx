import { AdminDashboard } from "../components/admin/AdminDashboard";
import { DisputePanel } from "../components/admin/DisputePanel";
import { VerificationQueue } from "../components/admin/VerificationQueue";

export function AdminPage() {
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Admin</h1><AdminDashboard /><VerificationQueue /><DisputePanel /></div>;
}
