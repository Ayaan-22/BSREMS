import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { useChainId, useSwitchChain } from "wagmi";
import { CHAIN_IDS } from "../../lib/constants";
import { Button } from "../ui/Button";

export function NetworkGuard({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  if (chainId !== CHAIN_IDS.sepolia && chainId !== CHAIN_IDS.hardhat) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-warning/30 bg-warning/[.06] p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-warning/15 text-warning">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <p className="mt-5 font-display text-3xl text-white">Wrong network</p>
        <p className="mt-2 text-sm text-muted">BSREMS runs on Sepolia or a local Hardhat node.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => switchChain({ chainId: CHAIN_IDS.hardhat })}>Hardhat local</Button>
          <Button variant="secondary" onClick={() => switchChain({ chainId: CHAIN_IDS.sepolia })}>
            Sepolia
          </Button>
        </div>
      </div>
    );
  }
  return children;
}
