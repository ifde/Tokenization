// Build bundle.js file first
// npx browserify test.js -o dist/bundle.js
// Then run the code

// Build bundle1.js file first
// yarn run webpack
// Then run the code

import { Buffer } from 'buffer';
window.Buffer = Buffer;
import process from 'process';
window.process = process;

const sigUtil = require('@metamask/eth-sig-util');
// const Buffer = require('buffer/').Buffer;
// import express from "express";
import { ethers } from "ethers";
import { upload, download } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
const CryptoJS = require("crypto-js");

const CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const CONTRACT_ABI = [{"type":"event","anonymous":false,"name":"DataAdded","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"string","name":"ipfsHash","indexed":false},{"type":"string","name":"encryptedAESKey","indexed":false},{"type":"uint256","name":"timestamp","indexed":false}]},{"type":"event","anonymous":false,"name":"DataDeleted","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false}]},{"type":"event","anonymous":false,"name":"DataUpdated","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false},{"type":"string","name":"newIpfsHash","indexed":false},{"type":"string","name":"newEncryptedAESKey","indexed":false}]},{"type":"function","name":"clearUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[]},{"type":"function","name":"deleteUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"}],"outputs":[]},{"type":"function","name":"getUserFitnessData","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[{"type":"tuple[]","name":"","components":[{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"},{"type":"uint256","name":"timestamp"}]}]},{"type":"function","name":"hello","constant":true,"stateMutability":"pure","payable":false,"inputs":[],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"storeFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"}],"outputs":[]},{"type":"function","name":"updateUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"},{"type":"string","name":"newIpfsHash"},{"type":"string","name":"newEncryptedAESKey"}],"outputs":[]}];





let provider = window.ethereum;
let fitnessContract;

// Initialize the provider and contract
async function init() {
  const provider = new ethers.JsonRpcProvider();
  // A key to a local test wallet
  const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
  fitnessContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// Get public key from MetaMask
async function getMetaMaskEncryptionPublicKey() {
  try {

    const accounts = await provider.enable();
    const account = accounts[0];
    // Use the MetaMask provider directly to call `eth_getEncryptionPublicKey`
    const publicKey = await provider.request({
      method: "eth_getEncryptionPublicKey",
      params: [account], // The account to get the encryption key for
    });

    return publicKey;
  } catch (error) {
    console.error("Error getting MetaMask encryption public key:", error);
    throw error;
  }
}

// Encrypt message
function encryptMessage(publicKey, message) {
  try {
    const buf = Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({
          publicKey: publicKey,
          data: message,
          version: 'x25519-xsalsa20-poly1305'
        })
      ),
      'utf8'
    );
    return '0x' + buf.toString('hex');
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

// Decrypt message
async function decryptMessage(encryptedMessage) {
  try {

    const provider = window.ethereum
    const accounts = await provider.enable()
    const account = accounts[0];

    const decryptedMessage = await provider.request({"method": "eth_decrypt", "params": [encryptedMessage, account]});
    console.log("Decrypted Message:", decryptedMessage);
    return decryptedMessage;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

// Upload file to IPFS
async function uploadToIPFS(file) {
  const client = createThirdwebClient({ clientId: "3f7ea9dbfcdc8079c39087ed3a4ebfd0" });
  const ipfsHash = await upload({ client, files: [file] });
  return ipfsHash;
}

// Retreive file to IPFS
async function retrieveFromIPFS(ipfsHash) {
  const client = createThirdwebClient({ clientId: "3f7ea9dbfcdc8079c39087ed3a4ebfd0" });
  const file = await download({ client, uri: ipfsHash });
  return file;
}
// Encrypt IPFS hash using AES
function encryptIPFSHash(hash) {
  const key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  const encrypted = CryptoJS.AES.encrypt(hash, key).toString();
  return { encryptedHash: encrypted, encryptionKey: key };
}

// Encrypt AES key with MetaMask public key
async function encryptAESKeyWithMetaMask(publicKey, aesKey) {
  const encoder = new TextEncoder();
  const encodedKey = encoder.encode(aesKey);
  const encryptedAESKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    encodedKey
  );
  return encryptedAESKey;
}

// Store data in smart contract
async function storeDataInContract(userId, encryptedHash, encryptedAESKey) {
  const tx = await fitnessContract.storeFitnessData(userId, encryptedHash, encryptedAESKey);
  await tx.wait();
}

// Handle file upload
async function handleFileUpload(event) {
  const file = event.target.files[0];
  const ipfsHash = await uploadToIPFS(file);
  console.log("Initial IPFS Hash:", ipfsHash);
  const { encryptedHash, encryptionKey } = encryptIPFSHash(ipfsHash);
  console.log("Initial AES Key:", encryptionKey);
  const publicKey = await getMetaMaskEncryptionPublicKey();
  const encryptedAESKey = encryptMessage(publicKey, encryptionKey);

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];

  await storeDataInContract(account, encryptedHash, encryptedAESKey);
  alert("File uploaded and data stored successfully!");
  console.log("Account:", account);
  console.log("Encrypted Hash:", encryptedHash);
  console.log("Encrypted AES Key:", encryptedAESKey);
}

// Retrieve and decrypt data
async function retrieveAndDecryptData() {

const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
const account = accounts[0];

console.log("Account to retreive from:", account);

  const userFitnessData = await fitnessContract.getUserFitnessData(account);
  const { ipfsHash, encryptedAESKey } = userFitnessData[0];
  const decryptedAESKey = await decryptMessage(encryptedAESKey);
  console.log("Decrypted AES Key:", decryptedAESKey);
  const decryptedIPFSHash = CryptoJS.AES.decrypt(ipfsHash, decryptedAESKey).toString(CryptoJS.enc.Utf8);
  console.log("Decrypted IPFS Hash:", decryptedIPFSHash);
  const fileContent = await retrieveFromIPFS(decryptedIPFSHash);
  console.log("Retrieved File Content:", fileContent);


  // Assuming the file is an image, create a URL and display it
  // const blob = new Blob([JSON.stringify(fileContent)], { type: 'application/json' });
  const { url } = fileContent;
  document.getElementById("retrievedImage").src = url;
}

// Event listeners
document.getElementById("fileInput").addEventListener("change", handleFileUpload);
document.getElementById("retrieveButton").addEventListener("click", retrieveAndDecryptData);

const connectButton = document.getElementById("connect");

connectButton.addEventListener("click", async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    console.log("Connected account:", account);
  } else {
    console.error("MetaMask is not installed.");
  }
});

// Initialize
init();