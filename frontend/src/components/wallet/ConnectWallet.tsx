import { LogOut, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "../../lib/utils";
import { AddressAvatar } from "../common/AddressBadge";
import { Button } from "../ui/Button";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return (
      <Button variant="secondary" size="sm" className="group h-10 pl-1.5 pr-4" onClick={() => disconnect()} title="Disconnect">
        <AddressAvatar address={address} className="h-7 w-7" />
        <span className="font-mono text-xs">{shortenAddress(address)}</span>
        <LogOut className="h-3.5 w-3.5 text-muted transition group-hover:text-white" />
      </Button>
    );
  }
  return (
    <Button size="sm" className="h-10 px-5" disabled={isPending} onClick={() => connect({ connector: connectors[0] })}>
      <Wallet className="h-4 w-4" />
      {isPending ? "Connecting…" : "Connect"}
    </Button>
  );
}
