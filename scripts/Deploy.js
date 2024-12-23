
/*
Deployment script.
Run: "npx hardhat run scripts/Deploy.ts --network localhost" to deploy locally 
(don't forget "npx hardhat node" before that to start a local node)
Run: npx hardhat run scripts/Deploy.ts --network bscTestnet to deploy on a testNet
*/
import hardhat from "hardhat";
const { ethers } = hardhat;
import { setContractDetails, CONTRACT_ADDRESS } from "../global.js";

async function main() {
    // Deploy the contract
    const FitnessDataStorage = await ethers.getContractFactory("FitnessDataStorage");
    const fitnessDataStorage = await FitnessDataStorage.deploy();
    const address = await fitnessDataStorage.getAddress();
    console.log("Contract deployed to:", address);

    // Save contract address and ABI in global variables

    console.log("If deploy the contract again, \n Save address and ABI below to global.js");

    console.log("Contract address: \n", address);
    console.log("Contract ABI: \n", fitnessDataStorage.interface.formatJson());
}



main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
