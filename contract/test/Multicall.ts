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
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    const Mul = await ethers.getContractFactory("MyMulticall");
    const mul = await Mul.deploy();

    return { token, mul, owner };
  }

  describe("Mul", function () {
    it("call", async function () {
      const { token, mul, owner } = await loadFixture(deploy);

      await token.safeMint(owner.address, "http ssss");
      await token.safeMint(owner.address, "http ssss");
      await token.safeMint(owner.address, "http ssss");
      
      let request: any[] = [];
      request.push({function: 'getTokenData', args: 0 })
      console.log(await mul.multicall(token.address, request))
    });
  });
});