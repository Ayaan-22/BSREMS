import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { PageWrapper } from "./components/layout/PageWrapper";
import { NetworkGuard } from "./components/wallet/NetworkGuard";
import { AdminPage } from "./pages/AdminPage";
import { BrowsePage } from "./pages/BrowsePage";
import { DashboardPage } from "./pages/DashboardPage";
import { EscrowPage } from "./pages/EscrowPage";
import { HomePage } from "./pages/HomePage";
import { ListPropertyPage } from "./pages/ListPropertyPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PropertyPage } from "./pages/PropertyPage";

export function App() {
  return (
    <ErrorBoundary>
      <PageWrapper>
        <NetworkGuard>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
            <Route path="/list" element={<ListPropertyPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/escrow" element={<EscrowPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NetworkGuard>
      </PageWrapper>
    </ErrorBoundary>
  );
}
