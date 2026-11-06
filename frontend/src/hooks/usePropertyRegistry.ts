import { useQuery } from "@tanstack/react-query";
import { useReadContract, useWriteContract } from "wagmi";
import { contracts, propertyRegistryAbi } from "../lib/contracts";
import { API_URL } from "../lib/constants";
import type { Property } from "../types/property";

export function useActiveProperties(offset = 0, limit = 12) {
  return useReadContract({
    address: contracts.propertyRegistry,
    abi: propertyRegistryAbi,
    functionName: "getAllActiveProperties",
    args: [BigInt(offset), BigInt(limit)],
    query: { enabled: Boolean(contracts.propertyRegistry) }
  });
}

export function usePropertySearch(params: Record<string, string | boolean | number>) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: async () => {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => search.set(key, String(value)));
      const response = await fetch(`${API_URL}/api/properties?${search.toString()}`);
      if (!response.ok) throw new Error("Failed to load properties");
      return response.json() as Promise<{ items: Property[] }>;
    }
  });
}

export function useListProperty() {
  return useWriteContract();
}
