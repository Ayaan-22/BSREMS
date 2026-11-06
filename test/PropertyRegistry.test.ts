import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("PropertyRegistry", function () {
  async function fixture() {
    const [admin, owner, verifier, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("PropertyRegistry");
    const registry = await upgrades.deployProxy(Registry, [admin.address], { kind: "uups" });
    await registry.waitForDeployment();
    await registry.connect(admin).grantRole(await registry.VERIFIER_ROLE(), verifier.address);
    return { registry, admin, owner, verifier, other };
  }

  it("lists property, emits event, increments count, and stores correctly", async function () {
    const { registry, owner } = await fixture();
    await expect(registry.connect(owner).listProperty("ipfs://meta", 100n))
      .to.emit(registry, "PropertyListed")
      .withArgs(1n, owner.address, 100n);
    expect(await registry.propertyCount()).to.equal(1n);
    const property = await registry.getProperty(1);
    expect(property.owner).to.equal(owner.address);
    expect(property.ipfsMetadataHash).to.equal("ipfs://meta");
  });

  it("rejects empty IPFS hash or zero price", async function () {
    const { registry, owner } = await fixture();
    await expect(registry.connect(owner).listProperty("", 100n)).to.be.revertedWithCustomError(registry, "InvalidMetadata");
    await expect(registry.connect(owner).listProperty("ipfs://meta", 0)).to.be.revertedWithCustomError(registry, "InvalidPrice");
  });

  it("only owner can update or delist", async function () {
    const { registry, owner, other } = await fixture();
    await registry.connect(owner).listProperty("ipfs://meta", 100n);
    await expect(registry.connect(other).updateProperty(1, "ipfs://new", 200n)).to.be.revertedWithCustomError(registry, "NotPropertyOwner");
    await registry.connect(owner).updateProperty(1, "ipfs://new", 200n);
    await registry.connect(owner).delistProperty(1);
    expect((await registry.getProperty(1)).status).to.equal(3);
  });

  it("verifier role can verify, non-verifier cannot", async function () {
    const { registry, owner, verifier, other } = await fixture();
    await registry.connect(owner).listProperty("ipfs://meta", 100n);
    await expect(registry.connect(other).verifyProperty(1)).to.be.reverted;
    await registry.connect(verifier).verifyProperty(1);
    expect(await registry.verifiedProperties(1)).to.equal(true);
  });

  it("paginates active properties", async function () {
    const { registry, owner } = await fixture();
    for (let i = 0; i < 14; i++) {
      await registry.connect(owner).listProperty(`ipfs://meta-${i}`, BigInt(i + 1));
    }
    const page = await registry.getAllActiveProperties(12, 12);
    expect(page.length).to.equal(2);
    expect(page[0].id).to.equal(13n);
  });
});
