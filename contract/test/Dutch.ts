import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Dutch", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deploy() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy();

    return { token, market, owner, otherAccount };
  }

  describe("Market", function () {
    it("Fixed", async function () {
      const { token, market, otherAccount } = await loadFixture(deploy);

      await token.safeMint(otherAccount.address, "http ssss");
      await token.connect(otherAccount).approve(market.address, 0);
      
      console.log('before:', await token.ownerOf(0))
      await market.connect(otherAccount).duAuctionStart(token.address, 0, ethers.utils.parseEther('10'), ethers.utils.parseEther('6'), 1659512260);
      console.log('after:', await token.ownerOf(0))

      console.log(await market.getStatus(token.address, 0));
      console.log(await market.getDuAuction(token.address, 0));

      // for (let i = 0; i < 10; i++) {
      //   await sleep(1000);
      //   console.log(await (await market.getDuAuction(token.address, 0)).nowPrice);
      // }

      //await market.fixedRevoke(token.address, 0);
      //await market.connect(otherAccount).duAuctionRevoke(token.address, 0);

      await market.duAuctionBid(token.address, 0, {value: ethers.utils.parseEther('12')})

      console.log(await market.getStatus(token.address, 0));
      console.log('afterrevoke:', await token.ownerOf(0))      
    });

    // it("FixedPurchase", async function () {
    //   const { token, market, otherAccount } = await loadFixture(deploy);

    //   await token.safeMint(otherAccount.address, "http ssss");
    //   await token.connect(otherAccount).approve(market.address, 0);
      
    //   console.log('before:', await token.ownerOf(0))
    //   await market.connect(otherAccount).fixedStart(token.address, 0, ethers.utils.parseEther('1'), 1659512260);
    //   console.log('after:', await token.ownerOf(0))

    //   await market.fixedPurchase(token.address, 0, {value: ethers.utils.parseEther('1')})
    //   console.log(await market.getStatus(token.address, 0));
    //   console.log('afterPurchase:', await token.ownerOf(0));

    //   console.log(await otherAccount.getBalance())
      
    // });
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

