import type { MouseEvent } from "react";
import type { Property, PropertyStatus } from "../types/property";

/**
 * Seeded listings have no IPFS images yet. Pick a stable cover from a curated
 * pool by property id so each listing keeps the same look across pages.
 */
const COVER_POOL = [
  "1600585154340-be6161a56a0c",
  "1613490493576-7fde63acd811",
  "1600596542815-ffad4c1539a9",
  "1512917774080-9991f1c4c750",
  "1600047509807-ba8f99d2cdde",
  "1580587771525-78b9dba3b914",
  "1605276374104-dee2a0ed3cd6",
  "1564013799919-ab600027ffc6",
  "1600566753190-17f0baa2a6c3",
  "1568605114967-8130f3a36994",
  "1583608205776-bfd35f0d9f83",
  "1570129477492-45c003edd2be"
];

const INTERIOR_POOL = [
  "1600607687939-ce8a6c25118c",
  "1600210492486-724fe5c67fb0",
  "1502672260266-1c1ef2d93688",
  "1522708323590-d24dbb6b0267"
];

export function unsplash(id: string, width = 1200) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
}

function seedOf(value: string | number | undefined) {
  const text = String(value ?? "0");
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return hash;
}

export function coverFor(property?: Partial<Property>, width = 1200) {
  const own = property?.metadata?.images?.[0];
  if (own) return own;
  const key = property?.propertyId ?? property?._id;
  return unsplash(COVER_POOL[seedOf(key) % COVER_POOL.length], width);
}

export function galleryFor(property?: Partial<Property>) {
  const own = property?.metadata?.images;
  if (own?.length) return own;
  const seed = seedOf(property?.propertyId ?? property?._id);
  return [
    coverFor(property, 1600),
    unsplash(INTERIOR_POOL[seed % INTERIOR_POOL.length], 900),
    unsplash(INTERIOR_POOL[(seed + 2) % INTERIOR_POOL.length], 900)
  ];
}

export function propertyTitle(property?: Partial<Property>) {
  return property?.metadata?.name || `Property No. ${property?.propertyId ?? "—"}`;
}

/** Two-stop gradient derived from a wallet address, used as an avatar. */
export function addressGradient(address?: string) {
  const seed = seedOf(address?.toLowerCase());
  const hueA = seed % 360;
  const hueB = (hueA + 70 + ((seed >> 8) % 90)) % 360;
  return `conic-gradient(from ${(seed >> 4) % 360}deg, hsl(${hueA} 80% 62%), hsl(${hueB} 75% 55%), hsl(${hueA} 80% 62%))`;
}

export const STATUS_STYLES: Record<PropertyStatus, { label: string; dot: string; chip: string }> = {
  Active: { label: "For sale", dot: "bg-accent", chip: "text-accent-soft border-accent/30 bg-accent/10" },
  UnderContract: { label: "In escrow", dot: "bg-gold", chip: "text-gold-soft border-gold/30 bg-gold/10" },
  Sold: { label: "Sold", dot: "bg-iris", chip: "text-violet-200 border-iris/30 bg-iris/10" },
  Delisted: { label: "Delisted", dot: "bg-slate-500", chip: "text-slate-300 border-white/10 bg-white/5" }
};

/** Updates --mx/--my so `.spotlight` can follow the cursor. */
export function trackSpotlight(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function shortHash(hash?: string, size = 6) {
  if (!hash) return "—";
  return `${hash.slice(0, size + 2)}…${hash.slice(-4)}`;
}

export function timeAgo(value?: string) {
  if (!value) return "";
  const seconds = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 1000));
  const units: Array<[number, string]> = [
    [86400, "d"],
    [3600, "h"],
    [60, "m"]
  ];
  for (const [size, label] of units) if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  return `${seconds}s ago`;
}
