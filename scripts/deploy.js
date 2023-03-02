require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account: ", deployer.address)

  const TheRisk = await ethers.getContractFactory("TheRisk")
  const MockUSDT = await ethers.getContractFactory("MockUSDT")

  const theRisk = await TheRisk.deploy()
  await theRisk.deployed()
  console.log("Deployed `TheRisk` at: ", theRisk.address)

  const mockUSDT = await MockUSDT.deploy()
  await mockUSDT.deployed()
  console.log("Deployed `MockUSDT` at: ", mockUSDT.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
