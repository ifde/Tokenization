
/*
Deployment script.
Run: "npx hardhat run scripts/Deploy.ts --network localhost" to deploy locally 
(don't forget "npx hardhat node" before that to start a local node)
Run: npx hardhat run scripts/Deploy.ts --network bscTestnet to deploy on a testNet
*/

import { ethers } from "hardhat";
import { setContractDetails } from "../global";

async function main() {
    // Deploy the contract
    const FitnessDataStorage = await ethers.getContractFactory("FitnessDataStorage");
    const fitnessDataStorage = await FitnessDataStorage.deploy();
    const address = await fitnessDataStorage.getAddress();
    console.log("Contract deployed to:", address);

    // Save contract address and ABI in global variables
    
    setContractDetails(address, fitnessDataStorage.interface.formatJson());

    console.log("Contract address and ABI saved for later use in global.ts");

    console.log(address);
    console.log(fitnessDataStorage.interface.formatJson());
}



main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
