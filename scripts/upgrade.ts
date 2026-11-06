import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  const deployment = JSON.parse(fs.readFileSync(`deployments/${hre.network.name}.json`, "utf8"));
  const contractName = process.env.UPGRADE_CONTRACT || "PropertyRegistry";
  const proxyAddress = deployment.contracts[contractName];
  if (!proxyAddress) throw new Error(`Missing deployment for ${contractName}`);
  const Factory = await ethers.getContractFactory(contractName);
  const upgraded = await upgrades.upgradeProxy(proxyAddress, Factory);
  await upgraded.waitForDeployment();
  console.info(`${contractName} upgraded at ${await upgraded.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
