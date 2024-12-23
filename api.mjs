import express from "express";
import { ethers, JsonRpcProvider } from "ethers";
import { upload, download } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
import {CONTRACT_ADDRESS, CONTRACT_ABI} from "./global.ts"
import fs from "fs";

const app = express();
app.use(express.json());

// IPFS Client Setup
const client = createThirdwebClient({ clientId: "3f7ea9dbfcdc8079c39087ed3a4ebfd0" });

// Blockchain Setup
const provider = new ethers.JsonRpcProvider();
// const provider1 = new ethers.providers.JsonRpcProvider(); // local host for now
const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
//const signer = await ethers.provider.getSigner()
const contractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "userId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DataAdded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      }
    ],
    "name": "getUserFitnessData",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "hello",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "userId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "storeFitnessData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
const fitnessContract = new ethers.Contract(contractAddress, contractABI, signer);

// Endpoint to store JSON file and save IPFS hash in contract
app.post("/store", async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("User ID:", userId);

        // Assume JSON file is sent as a base64 string in the request
        const jsonBase64 = req.body.file;
        const jsonBuffer = Buffer.from(jsonBase64, "base64");

        const jsonData = JSON.parse(jsonBuffer);

        console.log("Raw JSON Data:", jsonData);

        // Upload JSON to IPFS
        const jsonFile = new File([jsonBuffer], "fitnessData.json", { type: "application/json" });
        const ipfsHash = await upload({ client, files: [jsonFile] });
        console.log("IPFS Hash:", ipfsHash);

        // Store IPFS hash in smart contract
        const tx = await fitnessContract.storeFitnessData(userId, ipfsHash);
        await tx.wait();

        res.json({ success: true, ipfsHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to store data" });
    }
});

// Endpoint to retrieve data from contract and fetch JSON from IPFS
app.get("/retrieve/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Retrieve data from the contract
        const userFitnessData = await fitnessContract.getUserFitnessData(userId);
        const ipfsHashes = userFitnessData.map(data => data);

        // Fetch JSON from IPFS
        const jsonFiles = await Promise.all(
            ipfsHashes.map(async (hash) => {
                const file = await download({ client, uri: hash });
                const jsonContent = await file.text();
                return JSON.parse(jsonContent);
            })
        );

        res.json({ userId, fitnessData: jsonFiles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve data" });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});


