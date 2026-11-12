import { ArrowRight, BadgeCheck, Blocks, FileSignature, KeyRound, Landmark, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { formatEther } from "viem";
import { AddressAvatar } from "../components/common/AddressBadge";
import { CountUp } from "../components/common/CountUp";
import { useLiveBlock } from "../components/common/LiveBlock";
import { Reveal } from "../components/common/Reveal";
import { DeedCard } from "../components/property/DeedCard";
import { PropertyGrid } from "../components/property/PropertyGrid";
import { Button } from "../components/ui/Button";
import { usePlatformStats, usePropertySearch } from "../hooks/usePropertyRegistry";
import { shortenAddress } from "../lib/utils";
import { propertyTitle, trackSpotlight } from "../lib/visuals";
import type { Property } from "../types/property";

const steps = [
  { icon: Landmark, title: "List", body: "Mint a listing in the PropertyRegistry with metadata pinned to IPFS." },
  { icon: ShieldCheck, title: "Verify", body: "A verifier role attests the deed and documents. The badge is on-chain." },
  { icon: WalletCards, title: "Escrow", body: "Buyer funds lock in EscrowManager until both parties approve." },
  { icon: KeyRound, title: "Transfer", body: "Settlement mints an ERC-721 deed to the new owner, with royalties." }
];

export function HomePage() {
  const featured = usePropertySearch({ limit: 6, status: "Active" });
  const all = usePropertySearch({ limit: 50 });
  const stats = usePlatformStats();
  const block = useLiveBlock();

  const items = featured.data?.items ?? [];
  const listedWei = (all.data?.items ?? []).reduce((sum, item) => sum + BigInt(item.priceWei || "0"), 0n);
  const hero = items[0];

  return (
    <div className="space-y-28">
      {/* Hero */}
      <section className="relative grid items-center gap-14 pt-6 lg:grid-cols-[1.1fr_.9fr] lg:pt-12">
        <div>
          <p className="eyebrow animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" /> Real estate protocol · Live on chain 31337
          </p>
          <h1 className="mt-6 animate-fade-up font-display text-[3.4rem] leading-[0.95] tracking-tight text-white [animation-delay:80ms] sm:text-7xl lg:text-[5.6rem]">
            Property,
            <br />
            <em className="text-gradient pr-2">settled</em> on-chain.
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-slate-400 [animation-delay:160ms]">
            Verified listings, trustless escrow, rental agreements and NFT deeds. No title company in the middle — just contracts anyone can audit.
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Link to="/browse">
              <Button size="lg">
                Explore listings <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
            <Link to="/list">
              <Button size="lg" variant="secondary">
                List a property
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex animate-fade-up flex-wrap items-center gap-x-8 gap-y-4 text-sm text-slate-400 [animation-delay:320ms]">
            {[
              [BadgeCheck, "Role-based verification"],
              [Blocks, "UUPS upgradeable"],
              [FileSignature, "ERC-721 deeds"]
            ].map(([Icon, label]) => {
              const I = Icon as typeof BadgeCheck;
              return (
                <span key={label as string} className="flex items-center gap-2">
                  <I className="h-4 w-4 text-accent-soft" /> {label as string}
                </span>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:200ms] lg:max-w-none">
          <div className="absolute -inset-10 rounded-full bg-accent/20 blur-[90px]" />
          <div className="relative animate-float">
            <DeedCard property={hero} />
          </div>
          <div className="glass absolute -left-4 top-10 !bg-ink-800/90 hidden animate-float-delayed items-center gap-3 rounded-2xl px-4 py-3 shadow-float sm:flex lg:-left-12">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-success/15 text-success">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-white">Escrow secured</p>
              <p className="font-mono text-[10px] text-muted">funds locked until approval</p>
            </div>
          </div>
          <div className="glass absolute -right-3 bottom-24 !bg-ink-800/90 hidden animate-float items-center gap-3 rounded-2xl px-4 py-3 shadow-float [animation-delay:-3s] sm:flex lg:-right-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping2 rounded-full bg-success" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            <p className="font-mono text-xs text-slate-200">
              block <span className="text-white">#{block.data?.toString() ?? "—"}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Ticker of recent on-chain listings */}
      <ListingTicker items={all.data?.items ?? []} />

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Properties listed", value: all.data?.pagination?.total ?? all.data?.items.length ?? 0, decimals: 0, suffix: "" },
          { label: "Value on-chain", value: Number(formatEther(listedWei)), decimals: 2, suffix: " ETH" },
          { label: "Indexed events", value: stats.data?.transactionCount ?? 0, decimals: 0, suffix: "" },
          { label: "Latest block", value: Number(block.data ?? 0n), decimals: 0, suffix: "", prefix: "#" }
        ].map((stat, index) => (
          <Reveal key={stat.label} delay={index * 80}>
            <div onMouseMove={trackSpotlight} className="glass spotlight group h-full rounded-2xl p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{stat.label}</p>
              <p className="mt-4 font-display text-5xl leading-none text-white">
                <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-accent/60 via-white/10 to-transparent transition-all duration-700 group-hover:from-gold/70" />
            </div>
          </Reveal>
        ))}
      </section>

      {/* How it works */}
      <section>
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4"><span className="h-px w-6 bg-accent-soft/60" />How it works</p>
          <h2 className="font-display text-5xl leading-[1.02] tracking-tight text-white md:text-6xl">
            Four contracts. <em className="text-gradient">Zero</em> paperwork.
          </h2>
        </Reveal>
        <div className="relative grid gap-5 md:grid-cols-4">
          <div aria-hidden className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
          {steps.map(({ icon: Icon, title, body }, index) => (
            <Reveal key={title} delay={index * 120}>
              <div onMouseMove={trackSpotlight} className="glass spotlight group relative h-full rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1">
                <div className="mb-8 flex items-center justify-between">
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-accent-soft transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-glow">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl italic text-white/10 transition-colors duration-500 group-hover:text-gold/40">0{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow mb-4"><span className="h-px w-6 bg-accent-soft/60" />Fresh on-chain</p>
            <h2 className="font-display text-5xl leading-[1.02] tracking-tight text-white md:text-6xl">Featured properties</h2>
          </div>
          <Link to="/browse">
            <Button variant="secondary">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Reveal>
        <PropertyGrid properties={items} loading={featured.isLoading} />
      </section>

      {/* CTA */}
      <Reveal>
        <section className="ring-gradient relative overflow-hidden rounded-3xl bg-ink-800 px-8 py-16 text-center md:px-16 md:py-20">
          <div aria-hidden className="absolute inset-0 grid-bg opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
          <div aria-hidden className="absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[100px]" />
          <div aria-hidden className="absolute bottom-0 right-0 h-48 w-80 translate-x-1/4 translate-y-1/2 rounded-full bg-gold/20 blur-[90px]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-5xl leading-[1.02] tracking-tight text-white md:text-7xl">
              Your deed, <em className="text-gradient-gold">in your wallet.</em>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-slate-400">List a property in minutes. Verification, escrow and transfer all happen in the open.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/list">
                <Button size="lg" variant="gold">
                  Start a listing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/escrow">
                <Button size="lg" variant="secondary">
                  See escrow flow
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function ListingTicker({ items }: { items: Property[] }) {
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="mask-fade-x -mx-4 overflow-hidden border-y border-white/[.06] bg-white/[.015] py-4">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {row.map((item, index) => (
          <Link
            key={`${item._id}-${index}`}
            to={`/property/${item._id}`}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-xs text-slate-400 transition hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-slate-200">{propertyTitle(item)}</span>
            <span className="text-muted">listed at</span>
            <span className="text-accent-soft">{Number(formatEther(BigInt(item.priceWei || "0"))).toLocaleString()} ETH</span>
            <span className="text-muted">by</span>
            <AddressAvatar address={item.owner} className="h-4 w-4" />
            <span>{shortenAddress(item.owner)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
