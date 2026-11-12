import { useState } from "react";
import { cn } from "../../lib/utils";
import { unsplash } from "../../lib/visuals";

const FALLBACK = unsplash("1560518883-ce09059eeffa");

/** Resolves ipfs:// URIs through a public gateway and fades the image in on load. */
export function IPFSImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  const url = src?.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${src.replace("ipfs://", "")}` : src;
  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-700">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-ink-700 via-ink-600 to-ink-700" />}
      <img
        className={cn("h-full w-full object-cover transition-all duration-700", loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md", className)}
        src={url || FALLBACK}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(event) => {
          if (event.currentTarget.src !== FALLBACK) event.currentTarget.src = FALLBACK;
        }}
      />
    </div>
  );
}
