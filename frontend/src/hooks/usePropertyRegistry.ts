import { useQuery } from "@tanstack/react-query";
import { useReadContract, useWriteContract } from "wagmi";
import { contracts, propertyRegistryAbi } from "../lib/contracts";
import { API_URL } from "../lib/constants";
import type { Property } from "../types/property";

export type Pagination = { page: number; limit: number; total: number; pages: number };

export type ChainEvent = {
  _id: string;
  txHash: string;
  eventName: string;
  contract: string;
  blockNumber: number;
  blockTimestamp?: string;
  args?: Record<string, unknown>;
};

export type PlatformStats = {
  byStatus: Array<{ _id: string; count: number }>;
  transactionCount: number;
  generatedAt: string;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json() as Promise<T>;
}

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
    queryFn: () => {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== false) search.set(key, String(value));
      });
      return getJson<{ items: Property[]; pagination?: Pagination }>(`/api/properties?${search.toString()}`);
    },
    refetchInterval: 15000
  });
}

export function useProperty(id?: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => getJson<Property>(`/api/properties/${id}`),
    enabled: Boolean(id)
  });
}

export function usePropertyHistory(id?: string) {
  return useQuery({
    queryKey: ["property-history", id],
    queryFn: () => getJson<{ propertyId: number; events: ChainEvent[] }>(`/api/properties/${id}/history`),
    enabled: Boolean(id)
  });
}

export function usePlatformStats() {
  return useQuery({ queryKey: ["stats"], queryFn: () => getJson<PlatformStats>("/api/stats"), refetchInterval: 15000 });
}

export function useListProperty() {
  return useWriteContract();
}
