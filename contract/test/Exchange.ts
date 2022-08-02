import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

describe("Exchange", function () {
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

    return { token, market, owner };
  }

  describe("Market", function () {
    it("Eng", async function () {
      const { token, market } = await loadFixture(deploy);

      const a1 = (await ethers.getSigners())[1];
      const a2 = (await ethers.getSigners())[2];
      const a3 = (await ethers.getSigners())[3];

      await token.safeMint(a1.address, "http ssss");
      await token.safeMint(a2.address, "http bbvbm");
      await token.safeMint(a3.address, "http sda222");

      await token.connect(a1).approve(market.address, 0);
      await token.connect(a2).approve(market.address, 1);
      await token.connect(a3).approve(market.address, 2);
      
      await market.connect(a1).exchangeStart(token.address, 0, 1659512260);
      console.log(await market.getExchange(token.address, 0));

      await market.connect(a2).exchangeBid(token.address, 0, 1);
      console.log(await market.getExchange(token.address, 0));

      await market.connect(a3).exchangeBid(token.address, 0, 2);
      console.log(await market.getExchange(token.address, 0));

      //await market.connect(a3).exchangeWithdraw(token.address, 0, 2);
      //console.log(await market.getExchange(token.address, 0));

      // await market.connect(a1).exchangeEnd(token.address, 0, 2);
      // console.log(await market.getStatus(token.address, 0));
      // console.log(await token.ownerOf(0))
      // console.log(await token.ownerOf(1))
      // console.log(await token.ownerOf(2))

      await market.connect(a1).exchangeRevoke(token.address, 0);
      console.log(await token.ownerOf(0))
      console.log(await token.ownerOf(1))
      console.log(await token.ownerOf(2))
    });
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

