import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, Calendar, FileText, History, KeyRound, Ruler, ShieldCheck } from "lucide-react";
import { AddressBadge } from "../components/common/AddressBadge";
import { EthAmount } from "../components/common/EthAmount";
import { IPFSImage } from "../components/common/IPFSImage";
import { Skeleton } from "../components/common/Skeleton";
import { DeedCard } from "../components/property/DeedCard";
import { RentalForm } from "../components/rental/RentalForm";
import { StatusPill, VerifiedPill } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardTitle } from "../components/ui/Card";
import { useProperty, usePropertyHistory } from "../hooks/usePropertyRegistry";
import { cn } from "../lib/utils";
import { galleryFor, propertyTitle, shortHash, timeAgo } from "../lib/visuals";

export function PropertyPage() {
  const { id } = useParams();
  const { data: property, isLoading, error } = useProperty(id);
  const history = usePropertyHistory(id);
  const [active, setActive] = useState(0);
  const gallery = galleryFor(property ?? { _id: id });
  const details = property?.metadata?.details;

  if (error) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-center">
        <div>
          <p className="font-display text-5xl text-white">Listing not found</p>
          <p className="mt-3 text-muted">The API has no property with id <span className="font-mono">{id}</span>.</p>
          <Link to="/browse"><Button className="mt-6" variant="secondary"><ArrowLeft className="h-4 w-4" /> Back to browse</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All properties
      </Link>

      {/* Gallery */}
      <section className="grid gap-3 md:grid-cols-[2fr_1fr] md:grid-rows-2">
        {gallery.slice(0, 3).map((src, index) => (
          <button
            key={src}
            onClick={() => setActive(index)}
            className={cn(
              "focus-ring group relative overflow-hidden rounded-2xl",
              index === 0 ? "aspect-[16/10] md:row-span-2 md:aspect-auto" : "hidden aspect-[16/10] md:block",
              active === index && "ring-2 ring-accent/60"
            )}
          >
            <div className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-105">
              <IPFSImage src={gallery[index === 0 ? active : index]} alt={`${propertyTitle(property)} photo ${index + 1}`} />
            </div>
            {index === 0 && <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />}
          </button>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="min-w-0 space-y-6">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {property ? <StatusPill status={property.status} /> : <Skeleton className="h-7 w-24 rounded-full" />}
              {property && <VerifiedPill verified={property.verified} />}
              <span className="font-mono text-xs text-slate-500">ID #{property?.propertyId ?? "—"}</span>
            </div>
            {isLoading ? <Skeleton className="h-14 w-2/3" /> : <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-white md:text-6xl">{propertyTitle(property)}</h1>}
            <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
              {property?.metadata?.description || "Description, documents and amenities appear here once IPFS metadata is pinned for this listing. Price, owner and status below are read from the chain."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [BedDouble, "Bedrooms", details?.bedrooms],
              [Bath, "Bathrooms", details?.bathrooms],
              [Ruler, "Area", details?.area_sqft ? `${details.area_sqft.toLocaleString()} ft²` : undefined],
              [Calendar, "Built", details?.year_built]
            ].map(([Icon, label, value]) => {
              const I = Icon as typeof Bath;
              return (
                <div key={label as string} className="glass rounded-2xl p-4">
                  <I className="h-5 w-5 text-accent-soft" />
                  <p className="mt-3 text-xl font-semibold text-white">{(value as string | number | undefined) ?? "—"}</p>
                  <p className="text-xs text-muted">{label as string}</p>
                </div>
              );
            })}
          </div>

          <Card>
            <CardTitle icon={<History className="h-4 w-4" />} action={<span className="font-mono text-xs text-muted">{history.data?.events.length ?? 0} events</span>}>
              On-chain history
            </CardTitle>
            {history.isLoading && <Skeleton className="h-20" />}
            {!history.isLoading && !history.data?.events.length && <p className="text-sm text-muted">No events indexed yet.</p>}
            <ol className="relative space-y-1">
              {history.data?.events.map((event, index, list) => (
                <li key={event._id} className="relative flex gap-4 pb-5">
                  {index < list.length - 1 && <span className="absolute left-[11px] top-7 h-full w-px bg-gradient-to-b from-accent/50 to-white/5" />}
                  <span className="relative mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10">
                    <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(45,212,191,.9)]" />
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-white/[.06] bg-white/[.02] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">{event.eventName.replace(/([a-z])([A-Z])/g, "$1 $2")}</p>
                      <span className="font-mono text-[11px] text-muted">{timeAgo(event.blockTimestamp)}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-slate-400">
                      <span>{event.contract}</span>
                      <span>block #{event.blockNumber}</span>
                      <span title={event.txHash}>tx {shortHash(event.txHash)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <CardTitle icon={<FileText className="h-4 w-4" />}>Documents</CardTitle>
            {property?.metadata?.documents?.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {property.metadata.documents.map((doc) => (
                  <li key={doc.ipfs} className="flex items-center justify-between rounded-xl border border-white/[.06] bg-white/[.02] px-4 py-3 text-sm">
                    {doc.name} <ArrowUpRight className="h-4 w-4 text-muted" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">Title deed and inspection PDFs appear here once uploaded to IPFS.</p>
            )}
          </Card>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Card glow className="!bg-ink-800/80">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Asking price</p>
            {property ? <EthAmount value={property.priceWei} className="mt-2 text-4xl" /> : <Skeleton className="mt-2 h-10 w-40" />}
            <div className="my-6 space-y-3 border-y border-white/[.06] py-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Owner</span>
                <AddressBadge address={property?.owner} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Settlement</span>
                <span className="flex items-center gap-1.5 text-slate-200"><ShieldCheck className="h-4 w-4 text-success" /> EscrowManager</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Deed</span>
                <span className="flex items-center gap-1.5 text-slate-200"><KeyRound className="h-4 w-4 text-gold" /> ERC-721</span>
              </div>
            </div>
            <Button className="w-full" size="lg">Buy with escrow</Button>
            <Button className="mt-3 w-full" variant="secondary">Edit listing</Button>
          </Card>

          <Card>
            <CardTitle icon={<Calendar className="h-4 w-4" />}>Rent this property</CardTitle>
            <RentalForm />
          </Card>

          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Deed preview · minted on sale</p>
            <DeedCard property={property} />
          </div>
        </aside>
      </div>
    </div>
  );
}
