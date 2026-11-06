import { ArrowRight, ShieldCheck, WalletCards, KeyRound, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { PropertyGrid } from "../components/property/PropertyGrid";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { usePropertySearch } from "../hooks/usePropertyRegistry";

export function HomePage() {
  const { data } = usePropertySearch({ limit: 6, status: "Active" });
  const stats = [
    ["Total listings", data?.items?.length || 0],
    ["Total volume", "0 ETH"],
    ["Active escrows", 0]
  ];
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="flex min-h-[360px] flex-col justify-center rounded bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-8">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-normal md:text-6xl">BSREMS Pro</h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">Verified property listings, trustless escrow, rental agreements, and NFT deeds for real estate transactions.</p>
          <Link to="/browse" className="mt-6 w-fit"><Button>Browse properties <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
        <Card className="grid content-center gap-4">
          {stats.map(([label, value]) => <div key={label} className="rounded bg-background p-4"><p className="text-sm text-muted">{label}</p><p className="text-3xl font-bold">{value}</p></div>)}
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[[Home, "List"], [ShieldCheck, "Verify"], [WalletCards, "Escrow"], [KeyRound, "Transfer NFT"]].map(([Icon, label]) => <Card key={String(label)}><Icon className="mb-3 h-6 w-6 text-accent" /><p className="font-semibold">{String(label)}</p></Card>)}
      </section>
      <section><h2 className="mb-4 text-2xl font-bold">Featured Properties</h2><PropertyGrid properties={data?.items || []} /></section>
    </div>
  );
}
