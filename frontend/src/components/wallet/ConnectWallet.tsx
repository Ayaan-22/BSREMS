import { Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "../../lib/utils";
import { Button } from "../ui/Button";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  if (isConnected) {
    return <Button className="bg-white/10 text-white hover:bg-white/20" onClick={() => disconnect()}>{shortenAddress(address)}</Button>;
  }
  return (
    <Button onClick={() => connect({ connector: connectors[0] })}>
      <Wallet className="h-4 w-4" />
      Connect
    </Button>
  );
}
