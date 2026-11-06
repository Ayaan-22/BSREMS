import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("EscrowManager", function () {
  async function fixture() {
    const [admin, seller, buyer, arbiter, feeCollector, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("PropertyRegistry");
    const registry = await upgrades.deployProxy(Registry, [admin.address], { kind: "uups" });
    const Token = await ethers.getContractFactory("PropertyToken");
    const token = await Token.deploy(admin.address, feeCollector.address);
    const Escrow = await ethers.getContractFactory("EscrowManager");
    const escrow = await upgrades.deployProxy(
      Escrow,
      [admin.address, await registry.getAddress(), await token.getAddress(), feeCollector.address],
      { kind: "uups" }
    );
    await registry.grantRole(await registry.ESCROW_ROLE(), await escrow.getAddress());
    await token.grantRole(await token.ESCROW_CONTRACT(), await escrow.getAddress());
    await escrow.grantRole(await escrow.ARBITER_ROLE(), arbiter.address);
    await registry.connect(seller).listProperty("ipfs://meta", ethers.parseEther("1"));
    return { registry, token, escrow, admin, seller, buyer, arbiter, feeCollector, other };
  }

  it("completes happy path and deducts fee", async function () {
    const { escrow, seller, buyer } = await fixture();
    await escrow.connect(buyer).createEscrow(1, seller.address, 0, { value: ethers.parseEther("1") });
    await escrow.connect(buyer).approveDeal(1);
    await expect(escrow.connect(seller).approveDeal(1)).to.emit(escrow, "EscrowCompleted");
    const record = await escrow.escrows(1);
    expect(record.status).to.equal(2);
    expect(await escrow.accruedFees()).to.equal(ethers.parseEther("0.02"));
  });

  it("refunds after deadline expiry", async function () {
    const { escrow, seller, buyer } = await fixture();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    await escrow.connect(buyer).createEscrow(1, seller.address, now + 1, { value: ethers.parseEther("1") });
    await ethers.provider.send("evm_setNextBlockTimestamp", [now + 2]);
    await expect(escrow.connect(buyer).cancelEscrow(1)).to.emit(escrow, "EscrowRefunded");
  });

  it("resolves disputes for buyer or seller", async function () {
    const { escrow, seller, buyer, arbiter } = await fixture();
    await escrow.connect(buyer).createEscrow(1, seller.address, 0, { value: ethers.parseEther("1") });
    await escrow.connect(seller).raiseDispute(1);
    await expect(escrow.connect(arbiter).resolveDispute(1, false)).to.emit(escrow, "EscrowRefunded");
  });

  it("rejects non-participant approval or dispute", async function () {
    const { escrow, seller, buyer, other } = await fixture();
    await escrow.connect(buyer).createEscrow(1, seller.address, 0, { value: ethers.parseEther("1") });
    await expect(escrow.connect(other).approveDeal(1)).to.be.revertedWithCustomError(escrow, "NotParticipant");
    await expect(escrow.connect(other).raiseDispute(1)).to.be.revertedWithCustomError(escrow, "NotParticipant");
  });
});
