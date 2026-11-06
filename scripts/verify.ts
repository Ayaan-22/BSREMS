import { run } from "hardhat";
import fs from "fs";

async function main() {
  const network = hre.network.name;
  const deployment = JSON.parse(fs.readFileSync(`deployments/${network}.json`, "utf8"));
  for (const [name, address] of Object.entries<string>(deployment.contracts)) {
    try {
      await run("verify:verify", { address });
      console.info(`Verified ${name}: ${address}`);
    } catch (error: any) {
      console.warn(`Verification skipped for ${name}: ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
