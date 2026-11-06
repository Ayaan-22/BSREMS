import { formatEth } from "../../lib/utils";

export function EthAmount({ value }: { value?: bigint | string }) {
  return <span className="font-mono text-accent">{formatEth(value)}</span>;
}
