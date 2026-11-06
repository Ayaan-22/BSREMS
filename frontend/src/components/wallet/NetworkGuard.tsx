import { ReactNode } from "react";
import { useChainId, useSwitchChain } from "wagmi";
import { CHAIN_IDS } from "../../lib/constants";
import { Button } from "../ui/Button";

export function NetworkGuard({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  if (chainId !== CHAIN_IDS.sepolia && chainId !== CHAIN_IDS.hardhat) {
    return (
      <div className="rounded border border-warning/40 bg-warning/10 p-4">
        <p className="mb-3 text-warning">Wrong network. Switch to Sepolia or Hardhat local.</p>
        <Button onClick={() => switchChain({ chainId: CHAIN_IDS.sepolia })}>Switch to Sepolia</Button>
      </div>
    );
  }
  return children;
}
