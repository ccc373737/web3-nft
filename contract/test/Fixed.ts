import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token", function () {
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
    // it("Fixed", async function () {
    //   const { token, market, otherAccount } = await loadFixture(deploy);

    //   await token.safeMint(otherAccount.address, "http ssss");
    //   await token.connect(otherAccount).approve(market.address, 0);
      
    //   console.log('before:', await token.ownerOf(0))
    //   await market.connect(otherAccount).fixedStart(token.address, 0, 111333, 1659419950);
    //   console.log('after:', await token.ownerOf(0))

    //   console.log(await market.getStatus(token.address, 0));
    //   console.log(await market.getFixedPrice(token.address, 0));

    //   //await market.fixedRevoke(token.address, 0);
    //   await market.connect(otherAccount).fixedRevoke(token.address, 0);
    //   console.log(await market.getStatus(token.address, 0));
    //   console.log('afterrevoke:', await token.ownerOf(0))      
    // });

    it("FixedPurchase", async function () {
      const { token, market, otherAccount } = await loadFixture(deploy);

      await token.safeMint(otherAccount.address, "http ssss");
      await token.connect(otherAccount).approve(market.address, 0);
      
      console.log('before:', await token.ownerOf(0))
      await market.connect(otherAccount).fixedStart(token.address, 0, 111333, 1659512260);
      console.log('after:', await token.ownerOf(0))

      await market.fixedPurchase(token.address, 0, {value: 1200000})
      console.log(await market.getStatus(token.address, 0));
      console.log('afterPurchase:', await token.ownerOf(0));
      
      await token.approve(market.address, 0);
    });

    // it("Should set the right owner", async function () {
    //   const { lock, owner } = await loadFixture(deployOneYearLockFixture);

    //   expect(await lock.owner()).to.equal(owner.address);
    // });

    // it("Should receive and store the funds to lock", async function () {
    //   const { lock, lockedAmount } = await loadFixture(
    //     deployOneYearLockFixture
    //   );

    //   expect(await ethers.provider.getBalance(lock.address)).to.equal(
    //     lockedAmount
    //   );
    // });
  });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
