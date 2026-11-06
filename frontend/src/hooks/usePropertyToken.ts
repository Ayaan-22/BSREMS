import { useAccount } from "wagmi";

export function usePropertyToken() {
  const account = useAccount();
  return { account };
}
