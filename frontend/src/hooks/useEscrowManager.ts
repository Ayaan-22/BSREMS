import { useWriteContract } from "wagmi";

export function useEscrowManager() {
  return useWriteContract();
}
