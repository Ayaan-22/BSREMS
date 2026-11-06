import { useParams } from "react-router-dom";
import { AddressBadge } from "../components/common/AddressBadge";
import { EthAmount } from "../components/common/EthAmount";
import { IPFSImage } from "../components/common/IPFSImage";
import { RentalForm } from "../components/rental/RentalForm";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function PropertyPage() {
  const { id } = useParams();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <div className="aspect-video overflow-hidden rounded"><IPFSImage alt="Property" /></div>
        <Card><h1 className="text-3xl font-bold">Property #{id}</h1><p className="mt-2 text-muted">IPFS metadata, gallery, documents, amenities, and transaction history are displayed here once indexed.</p></Card>
        <Card><h2 className="mb-3 text-xl font-semibold">Transaction History</h2><p className="text-muted">Contract event feed</p></Card>
        <Card><h2 className="mb-3 text-xl font-semibold">NFT Deed</h2><p className="text-muted">Deed token appears after sale completion.</p></Card>
      </section>
      <aside className="space-y-4">
        <Card><div className="mb-3 flex items-center justify-between"><EthAmount value="0" /><AddressBadge /></div><Button className="w-full">Buy Now</Button><Button className="mt-3 w-full bg-white/10 text-white">Edit Listing</Button></Card>
        <Card><h2 className="mb-3 font-semibold">Rent</h2><RentalForm /></Card>
      </aside>
    </div>
  );
}
