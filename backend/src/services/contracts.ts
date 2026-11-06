import { ethers } from "ethers";
import { EventLog } from "../models/EventLog.js";
import { Property } from "../models/Property.js";

const registryAbi = [
  "event PropertyListed(uint256 indexed id,address indexed owner,uint256 price)",
  "event PropertyUpdated(uint256 indexed id,uint256 newPrice,uint8 status)",
  "event PropertyVerified(uint256 indexed id)",
  "event OwnershipTransferred(uint256 indexed id,address from,address to)",
  "function hasRole(bytes32,address) view returns (bool)",
  "function VERIFIER_ROLE() view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)"
];

export function provider() {
  return new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL || "http://127.0.0.1:8545");
}

export function registryContract() {
  const address = process.env.PROPERTY_REGISTRY_ADDRESS || ethers.ZeroAddress;
  return new ethers.Contract(address, registryAbi, provider());
}

export async function addressHasAdminAccess(address: string) {
  const registry = registryContract();
  if ((await registry.getAddress()) === ethers.ZeroAddress) return false;
  const verifier = await registry.VERIFIER_ROLE();
  const admin = await registry.DEFAULT_ADMIN_ROLE();
  return (await registry.hasRole(verifier, address)) || (await registry.hasRole(admin, address));
}

export function startIndexer() {
  const registry = registryContract();
  if (process.env.PROPERTY_REGISTRY_ADDRESS === undefined) return;

  registry.on("PropertyListed", async (id, owner, price, event) => {
    const block = await event.getBlock();
    await EventLog.updateOne(
      { txHash: event.log.transactionHash },
      {
        contract: "PropertyRegistry",
        eventName: "PropertyListed",
        propertyId: Number(id),
        args: { id: Number(id), owner, price: price.toString() },
        blockNumber: block.number,
        blockTimestamp: new Date(block.timestamp * 1000)
      },
      { upsert: true }
    );
    await Property.updateOne({ propertyId: Number(id) }, { owner: owner.toLowerCase(), priceWei: price.toString() }, { upsert: true });
  });
}
