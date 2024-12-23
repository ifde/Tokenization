import { ethers } from "hardhat";
import * as readline from "readline";
import fs from "fs";
import { upload, download } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";

// Set up readline for CLI input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question: string): Promise<string> => {
    return new Promise(resolve => rl.question(question, resolve));
};

async function main() {
    // Initialize Thirdweb Client
    const client = createThirdwebClient({
        clientId: "3f7ea9dbfcdc8079c39087ed3a4ebfd0"
    });

    // Prompt user for JSON file path and user ID
   // const filePath = await askQuestion("Enter the path to your JSON file: ");
    const filePath = "fitnessData.json";
    // const userId = await askQuestion("Enter the User ID: ");
    const userId = "1";

    // Read and upload JSON file to IPFS
    const jsonFile = new File([fs.readFileSync(filePath)], "fitnessData.json", {
        type: "application/json",
    });
    const uris = await upload({ client, files: [jsonFile] });
    const ipfsHash = uris; // Get the IPFS URI
    console.log(`Uploaded to IPFS. Hash: ${ipfsHash}`);

    // Deploy the smart contract
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with account:", deployer.address);

    const FitnessDataStorage = await ethers.getContractFactory("FitnessDataStorage");
    const fitnessDataStorage = await FitnessDataStorage.deploy();
    const address = await fitnessDataStorage.getAddress();
    console.log("Contract address: ", address);

    // Store the IPFS hash in the contract
    const tx = await fitnessDataStorage.storeFitnessData(userId, uris);
    await tx.wait();
    console.log(`Stored IPFS hash for User ID: ${userId}`);

    // await fitnessDataStorage.clearUserFitnessData("1");
    // await fitnessDataStorage.clearUserFitnessData("2");
    // await fitnessDataStorage.clearUserFitnessData("3");
    // await fitnessDataStorage.clearUserFitnessData("4");

    // Retrieve fitness data from the contract
    const userFitnessData = await fitnessDataStorage.getUserFitnessData(userId);
    console.log("Retrieved fitness data from contract:", userFitnessData);

    // Fetch the JSON from IPFS using the stored IPFS hash
    const file = await download({ client, uri: uris });
    const jsonContent = await file.text(); // Read as string
    const jsonData = JSON.parse(jsonContent); // Parse JSON
    console.log("Retrieved JSON data from IPFS:", jsonData);

    rl.close();
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
