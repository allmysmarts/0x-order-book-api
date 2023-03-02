const { expect } = require("chai")

describe("TheRisk(ERC20 with rebase functionality)", function () {
  describe("Deploy", function () {
    before(async function () {
      [owner] = await ethers.getSigners()
      TheRisk = await ethers.getContractFactory("TheRisk")
      token = await TheRisk.deploy();
      await token.deployed()
    })

    it("should configure params properly", async () => {
      expect(await token.name()).to.equal("Token with Rebase")
      expect(await token.symbol()).to.equal("TheRisk")
      expect(await token.decimals()).to.equal(18)
    })

    it("should pre-mint tokens to owner", async () => {
      expect(await token.totalSupply()).to.equal(ethers.BigNumber.from(10).pow(27))
      expect(await token.balanceOf(owner.address)).to.equal(ethers.BigNumber.from(10).pow(27))
    })
  })

  describe("User", function () {
    before(async function () {
      [owner, alice, bob] = await ethers.getSigners()
      TheRisk = await ethers.getContractFactory("TheRisk")
      token = await TheRisk.deploy();
      await token.deployed()
    })

    it("should be able to transfer tokens to other", async () => {
      await token.transfer(alice.address, ethers.BigNumber.from(10).pow(20))
      expect(await token.balanceOf(alice.address)).to.equal(ethers.BigNumber.from(10).pow(20))
    })

    it("should be able to approve tokens to other", async () => {
      await token.approve(alice.address, ethers.BigNumber.from(10).pow(20))
      await expect(
        token
          .connect(alice)
          .transferFrom(
            owner.address,
            bob.address,
            ethers.BigNumber.from(10).pow(21)
          )
      ).to.be.revertedWith("ERC20: insufficient allowance")

      await token.connect(alice).transferFrom(owner.address, bob.address, ethers.BigNumber.from(10).pow(20))
      expect(await token.balanceOf(bob.address)).to.equal(ethers.BigNumber.from(10).pow(20))
    })

    it("should be able to rebase", async () => {
      // increase rebaseFactor(denominator) as 200%, so balance decreases as 50%
      await token.rebase(100);
      expect(await token.balanceOf(alice.address)).to.equal(ethers.BigNumber.from(10).pow(19).mul(5))
      expect(await token.balanceOf(bob.address)).to.equal(ethers.BigNumber.from(10).pow(19).mul(5))
      expect(await token.totalSupply()).to.equal(ethers.BigNumber.from(10).pow(26).mul(5))

      // decrease rebaseFactor(denominator) as 50%, so balance increases as 200%
      await token.rebase(-50);
      expect(await token.balanceOf(alice.address)).to.equal(ethers.BigNumber.from(10).pow(20))
      expect(await token.balanceOf(bob.address)).to.equal(ethers.BigNumber.from(10).pow(20))
      expect(await token.totalSupply()).to.equal(ethers.BigNumber.from(10).pow(27))
    })
  })
})