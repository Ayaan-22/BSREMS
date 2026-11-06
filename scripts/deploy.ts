import { ethers, upgrades } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const feeCollector = process.env.FEE_COLLECTOR || deployer.address;

  const Registry = await ethers.getContractFactory("PropertyRegistry");
  const registry = await upgrades.deployProxy(Registry, [deployer.address], { kind: "uups" });
  await registry.waitForDeployment();

  const Token = await ethers.getContractFactory("PropertyToken");
  const token = await Token.deploy(deployer.address, feeCollector);
  await token.waitForDeployment();

  const Escrow = await ethers.getContractFactory("EscrowManager");
  const escrow = await upgrades.deployProxy(
    Escrow,
    [deployer.address, await registry.getAddress(), await token.getAddress(), feeCollector],
    { kind: "uups" }
  );
  await escrow.waitForDeployment();

  const Rental = await ethers.getContractFactory("RentalAgreement");
  const rental = await Rental.deploy(deployer.address, await registry.getAddress());
  await rental.waitForDeployment();

  const escrowRole = await registry.ESCROW_ROLE();
  await (await registry.grantRole(escrowRole, await escrow.getAddress())).wait();
  const tokenEscrowRole = await token.ESCROW_CONTRACT();
  await (await token.grantRole(tokenEscrowRole, await escrow.getAddress())).wait();

  const deployment = {
    network: hre.network.name,
    deployer: deployer.address,
    contracts: {
      PropertyRegistry: await registry.getAddress(),
      EscrowManager: await escrow.getAddress(),
      PropertyToken: await token.getAddress(),
      RentalAgreement: await rental.getAddress()
    }
  };

  fs.mkdirSync("deployments", { recursive: true });
  fs.writeFileSync(path.join("deployments", `${hre.network.name}.json`), JSON.stringify(deployment, null, 2));
  console.info(JSON.stringify(deployment, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
