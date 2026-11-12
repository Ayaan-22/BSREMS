import { PageHeader } from "../components/layout/PageWrapper";
import { PropertyForm } from "../components/property/PropertyForm";

export function ListPropertyPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        eyebrow="New listing"
        title={
          <>
            List a <em className="text-gradient">property</em>
          </>
        }
        description="Four steps. Metadata goes to IPFS, the listing goes on-chain, and verifiers take it from there."
      />
      <PropertyForm />
    </div>
  );
}
