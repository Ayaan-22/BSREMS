import { ethers } from "hardhat";
import fs from "fs";

const cities = ["Karachi", "Lahore", "Islamabad", "Peshawar", "Quetta"];

async function main() {
  const deployment = JSON.parse(fs.readFileSync(`deployments/${hre.network.name}.json`, "utf8"));
  const registry = await ethers.getContractAt("PropertyRegistry", deployment.contracts.PropertyRegistry);

  for (let i = 0; i < 10; i++) {
    const metadata = {
      name: `${i + 2}BR Smart Property in ${cities[i % cities.length]}`,
      description: "Seed listing for local BSREMS testing.",
      type: "residential",
      subtype: i % 2 === 0 ? "house" : "apartment",
      listing: "sale",
      price_eth: (0.2 + i / 10).toFixed(2),
      location: {
        address: `Street ${i + 1}`,
        city: cities[i % cities.length],
        country: "Pakistan",
        coordinates: { lat: 24.87 + i / 100, lng: 67.05 + i / 100 }
      },
      details: {
        bedrooms: i + 2,
        bathrooms: i + 1,
        area_sqft: 1200 + i * 120,
        year_built: 2015 + (i % 9),
        parking: true,
        furnished: i % 3 === 0
      },
      images: [`ipfs://seed-image-${i}`],
      documents: [],
      amenities: ["security", "parking"],
      created_at: new Date().toISOString(),
      schema_version: "1.0"
    };
    const hash = `ipfs://seed-${Buffer.from(JSON.stringify(metadata)).toString("hex").slice(0, 46)}`;
    const tx = await registry.listProperty(hash, ethers.parseEther(metadata.price_eth));
    const receipt = await tx.wait();
    console.info(`Seeded property ${i + 1}: ${receipt?.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
