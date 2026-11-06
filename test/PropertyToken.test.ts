import { expect } from "chai";
import { ethers } from "hardhat";

describe("PropertyToken", function () {
  it("mints deed only for escrow role and returns royalty", async function () {
    const [admin, escrow, buyer, feeCollector] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("PropertyToken");
    const token = await Token.deploy(admin.address, feeCollector.address);
    await expect(token.connect(buyer).mintDeed(buyer.address, 1, "ipfs://deed")).to.be.reverted;
    await token.grantRole(await token.ESCROW_CONTRACT(), escrow.address);
    await token.connect(escrow).mintDeed(buyer.address, 1, "ipfs://deed");
    expect(await token.tokenURI(1)).to.equal("ipfs://deed");
    const royalty = await token.royaltyInfo(1, 10_000n);
    expect(royalty[0]).to.equal(feeCollector.address);
    expect(royalty[1]).to.equal(100n);
  });
});
