import pinataSDK from "@pinata/sdk";
import { Readable } from "stream";

const PinataClient = pinataSDK as unknown as new (config: { pinataJWTKey: string }) => {
  pinJSONToIPFS: (body: unknown, options?: unknown) => Promise<{ IpfsHash: string }>;
  pinFileToIPFS: (stream: Readable) => Promise<{ IpfsHash: string }>;
};
const pinata = new PinataClient({ pinataJWTKey: process.env.PINATA_JWT || "" });

export async function pinJson(metadata: unknown) {
  if (!process.env.PINATA_JWT) {
    return { cid: `dev-${Buffer.from(JSON.stringify(metadata)).toString("hex").slice(0, 46)}` };
  }
  const result = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: "bsrems-property-metadata" } });
  return { cid: result.IpfsHash };
}

export async function pinFile(buffer: Buffer, filename: string) {
  if (!process.env.PINATA_JWT) return { cid: `dev-file-${Date.now()}-${filename}` };
  const stream = Readable.from(buffer) as Readable & { path?: string };
  stream.path = filename;
  const result = await pinata.pinFileToIPFS(stream);
  return { cid: result.IpfsHash };
}
