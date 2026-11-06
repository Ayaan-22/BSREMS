export function IPFSImage({ src, alt }: { src?: string; alt: string }) {
  const url = src?.startsWith("ipfs://") ? `https://ipfs.io/ipfs/${src.replace("ipfs://", "")}` : src;
  return <img className="h-full w-full object-cover" src={url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80"} alt={alt} />;
}
