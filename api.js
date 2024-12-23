import express from "express";
import { ethers } from "ethers";
import { upload, download } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./global.js";
import dotenv from 'dotenv';
import fs from "fs";


dotenv.config();
const { THIRDWEB_CLIENT_ID, LOCAL_PRIVATE_KEY } = process.env;

const app = express();
app.use(express.json());

// IPFS Client Setup
const client = createThirdwebClient({ clientId: THIRDWEB_CLIENT_ID });

// Blockchain Setup
const provider = new ethers.JsonRpcProvider();
// A key to a local test wallet
const signer = new ethers.Wallet(LOCAL_PRIVATE_KEY, provider);
const fitnessContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

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

// Endpoint to clear all fitness data for a user
app.delete("/clear/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const tx = await fitnessContract.clearUserFitnessData(userId);
        await tx.wait();

        res.json({ success: true, message: `All fitness data for user ${userId} cleared.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to clear fitness data" });
    }
});

// Endpoint to delete a specific entry for a user
app.delete("/delete", async (req, res) => {
    try {
        const { userId, index } = req.body;

        const tx = await fitnessContract.deleteFitnessData(userId, index);
        await tx.wait();

        res.json({ success: true, message: `Entry at index ${index} for user ${userId} deleted.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete specific entry" });
    }
});

// Endpoint to update a specific entry for a user
app.put("/update", async (req, res) => {
    try {
        const { userId, index, newIpfsHash } = req.body;

        const tx = await fitnessContract.updateFitnessData(userId, index, newIpfsHash);
        await tx.wait();

        res.json({ success: true, message: `Entry at index ${index} for user ${userId} updated.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update specific entry" });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});


