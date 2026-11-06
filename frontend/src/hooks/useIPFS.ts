import { useMutation } from "@tanstack/react-query";
import { API_URL } from "../lib/constants";

export function useIPFS() {
  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch(`${API_URL}/api/properties/ipfs/upload`, { method: "POST", body });
      if (!response.ok) throw new Error("IPFS upload failed");
      return response.json() as Promise<{ cid: string; uri: string }>;
    }
  });

  const pinMetadata = useMutation({
    mutationFn: async (metadata: unknown) => {
      const response = await fetch(`${API_URL}/api/properties/metadata`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata)
      });
      if (!response.ok) throw new Error("Metadata pin failed");
      return response.json() as Promise<{ cid: string; uri: string }>;
    }
  });

  return { uploadFile, pinMetadata };
}
