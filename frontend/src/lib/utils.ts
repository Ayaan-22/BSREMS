import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther, parseEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address?: string) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEth(value?: bigint | string) {
  if (!value) return "0 ETH";
  return `${Number(formatEther(BigInt(value))).toLocaleString(undefined, { maximumFractionDigits: 4 })} ETH`;
}

export function toWei(value: string) {
  return parseEther(value || "0");
}

export function formatDate(value?: string | number) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}
