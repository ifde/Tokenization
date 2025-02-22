const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FitnessDataNFT", function () {
  let FitnessDataNFT;
  let fitnessDataNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    FitnessDataNFT = await ethers.getContractFactory("FitnessDataNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    fitnessDataNFT = await FitnessDataNFT.deploy();
    await fitnessDataNFT.waitForDeployment();
    // const reciept = await fitnessDataNFT.deployTransaction.wait();
    // console.log("Gas used for deployment:", reciept.gasUsed.toString());
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await fitnessDataNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Store Fitness Data", function () {
    it("Should store fitness data and mint a new token", async function () {
      const userId = "user1";
      const ipfsHash = "QmTestHash";
      const encryptedAESKey = "encryptedKey";

      const tx = await fitnessDataNFT.storeFitnessData(userId, ipfsHash, encryptedAESKey);
      const receipt = await tx.wait();
      console.log("Gas used for storeFitnessData:", receipt.gasUsed.toString());

      const userData = await fitnessDataNFT.getUserFitnessData(userId);
      expect(userData.length).to.equal(1);
      expect(userData[0].ipfsHash).to.equal(ipfsHash);
      expect(userData[0].encryptedAESKey).to.equal(encryptedAESKey);
    });
  });

  describe("Update Fitness Data", function () {
    it("Should update fitness data", async function () {
      const userId = "user1";
      const ipfsHash = "QmTestHash";
      const encryptedAESKey = "encryptedKey";

      await fitnessDataNFT.storeFitnessData(userId, ipfsHash, encryptedAESKey);

      const newIpfsHash = "QmNewTestHash";
      const newEncryptedAESKey = "newEncryptedKey";
      const tx = await fitnessDataNFT.updateUserFitnessData(userId, 0, newIpfsHash, newEncryptedAESKey);
      const receipt = await tx.wait();
      console.log("Gas used for updateUserFitnessData:", receipt.gasUsed.toString());

      const userData = await fitnessDataNFT.getUserFitnessData(userId);
      expect(userData[0].ipfsHash).to.equal(newIpfsHash);
      expect(userData[0].encryptedAESKey).to.equal(newEncryptedAESKey);
    });
  });

  describe("Clear User Fitness Data", function () {
    it("Should clear all fitness data for a user", async function () {
      const userId = "user1";
      const ipfsHash = "QmTestHash";
      const encryptedAESKey = "encryptedKey";

      await fitnessDataNFT.storeFitnessData(userId, ipfsHash, encryptedAESKey);
      const tx = await fitnessDataNFT.clearUserFitnessData(userId);
      const receipt = await tx.wait();
      console.log("Gas used for clearUserFitnessData:", receipt.gasUsed.toString());

      const userData = await fitnessDataNFT.getUserFitnessData(userId);
      expect(userData.length).to.equal(0);
    });
  });

  describe("Delete User Fitness Data", function () {
    it("Should delete a specific entry from user fitness data", async function () {
      const userId = "user1";
      const ipfsHash = "QmTestHash";
      const encryptedAESKey = "encryptedKey";

      await fitnessDataNFT.storeFitnessData(userId, ipfsHash, encryptedAESKey);
      await fitnessDataNFT.storeFitnessData(userId, "QmAnotherHash", "anotherEncryptedKey");

      const tx = await fitnessDataNFT.deleteUserFitnessData(userId, 0);
      const receipt = await tx.wait();
      console.log("Gas used for deleteUserFitnessData:", receipt.gasUsed.toString());

      const userData = await fitnessDataNFT.getUserFitnessData(userId);
      expect(userData.length).to.equal(1);
      expect(userData[0].ipfsHash).to.equal("QmAnotherHash");
    });
  });
});