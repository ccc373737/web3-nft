import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("English", function () {
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
    it("Eng", async function () {
      const { token, market, otherAccount } = await loadFixture(deploy);

      await token.safeMint(otherAccount.address, "http ssss");
      await token.connect(otherAccount).approve(market.address, 0);
      
      console.log('before:', await token.ownerOf(0))
      await market.connect(otherAccount).enAuctionStart(token.address, 0, ethers.utils.parseEther('1'), ethers.utils.parseEther('0.5'), 1659882131);
      console.log('after:', await token.ownerOf(0))

      console.log(await market.getStatus(token.address, 0));
      console.log(await market.getEnAuction(token.address, 0));

      //bider1
      await market.enAuctionBid(token.address, 0, {value: ethers.utils.parseEther('1.5')});
      console.log(await market.getEnAuction(token.address, 0));

      //bider2
      let a3 = (await ethers.getSigners())[3];
      await market.connect(a3).enAuctionBid(token.address, 0, {value: ethers.utils.parseEther('2.0')});
      console.log(await market.getEnAuction(token.address, 0));

      //withdraw
      await market.enAuctionWithdraw(token.address, 0);
      console.log(await market.getEnAuction(token.address, 0));

      //bider1
      await market.enAuctionBid(token.address, 0, {value: ethers.utils.parseEther('2.5')});
      console.log(await market.getEnAuction(token.address, 0));

      // 

      //revoke
      await market.connect(otherAccount).enAuctionRevoke(token.address, 0);
      console.log(await market.getStatus(token.address, 0));
    });
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

