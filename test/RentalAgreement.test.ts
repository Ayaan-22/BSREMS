import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("RentalAgreement", function () {
  async function fixture() {
    const [admin, landlord, tenant] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("PropertyRegistry");
    const registry = await upgrades.deployProxy(Registry, [admin.address], { kind: "uups" });
    await registry.connect(landlord).listProperty("ipfs://rental", ethers.parseEther("10"));
    const Rental = await ethers.getContractFactory("RentalAgreement");
    const rental = await Rental.deploy(admin.address, await registry.getAddress());
    return { registry, rental, admin, landlord, tenant };
  }

  it("creates rental with deposit and tracks rent payment", async function () {
    const { rental, tenant } = await fixture();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    await rental.connect(tenant).createRental(1, ethers.parseEther("0.1"), now, now + 30 * 86400, { value: ethers.parseEther("0.2") });
    await expect(rental.connect(tenant).payRent(1, { value: ethers.parseEther("0.1") })).to.emit(rental, "RentPaid");
    const payments = await rental.getRentPaymentHistory(1);
    expect(payments.length).to.equal(1);
  });

  it("applies partial deposit penalty on early termination", async function () {
    const { rental, landlord, tenant } = await fixture();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    await rental.connect(tenant).createRental(1, ethers.parseEther("0.1"), now, now + 30 * 86400, { value: ethers.parseEther("0.2") });
    await rental.connect(tenant).terminateRental(1);
    await expect(rental.connect(landlord).releaseDeposit(1)).to.emit(rental, "DepositReleased");
  });
});
