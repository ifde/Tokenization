
//
// Run this command to build a bundle file:
// yarn run webpack
// Basically, it creates a file that contains all the code from the main.js file and its dependencies.
// And it can run directly in the browser without Node.js.
// We include bundle.js file in the index.html file.
//

import { Buffer } from 'buffer';
window.Buffer = Buffer;
import process from 'process';
window.process = process;

const sigUtil = require('@metamask/eth-sig-util');
import { ethers } from "ethers";
import { upload, download } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
const CryptoJS = require("crypto-js");

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = [{"type":"event","anonymous":false,"name":"DataAdded","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"string","name":"ipfsHash","indexed":false},{"type":"string","name":"encryptedAESKey","indexed":false},{"type":"uint256","name":"timestamp"}]},{"type":"event","anonymous":false,"name":"DataDeleted","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false}]},{"type":"event","anonymous":false,"name":"DataUpdated","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false},{"type":"string","name":"newIpfsHash","indexed":false},{"type":"string","name":"newEncryptedAESKey","indexed":false}]},{"type":"function","name":"clearUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[]},{"type":"function","name":"deleteUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"}],"outputs":[]},{"type":"function","name":"getUserFitnessData","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[{"type":"tuple[]","name":"","components":[{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"},{"type":"uint256","name":"timestamp"}]}]},{"type":"function","name":"hello","constant":true,"stateMutability":"pure","payable":false,"inputs":[],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"storeFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"}],"outputs":[]},{"type":"function","name":"updateUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"},{"type":"string","name":"newIpfsHash"},{"type":"string","name":"newEncryptedAESKey"}],"outputs":[]}];
const WALLET_PRIVATE_KEY = process.env.LOCAL_PRIVATE_KEY;

let provider = window.ethereum;
let fitnessContract;
const client = createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID });

// Initialize the provider and contract
async function init() {
  const provider = new ethers.JsonRpcProvider();
  const signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
  fitnessContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// Get public key from MetaMask
async function getMetaMaskEncryptionPublicKey() {
  try {
    const accounts = await provider.enable();
    const account = accounts[0];
    const publicKey = await provider.request({
      method: "eth_getEncryptionPublicKey",
      params: [account],
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
    const provider = window.ethereum;
    const accounts = await provider.enable();
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
  const ipfsHash = await upload({ client, files: [file] });
  console.log("Uploaded IPFS Hash:", ipfsHash);
  return ipfsHash;
}

// Retrieve file from IPFS
async function retrieveFromIPFS(ipfsHash) {
  const file = await download({ client, uri: ipfsHash });
  const jsonContent = await file.text();
  console.log("Retrieved JSON Content: ", jsonContent);
  return JSON.parse(jsonContent);
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

// Handle file selection
async function handleFileSelection(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const fileContent = JSON.parse(e.target.result);
    displayJson(fileContent, "jsonOutput");
    document.getElementById("uploadButton").disabled = false;
  };
  reader.readAsText(file);
}

// Handle default file selection
async function handleDefaultSelection() {
  const response = await fetch('./fitnessData.json');
  const fileContent = await response.json();
  displayJson(fileContent, "jsonOutput");
  document.getElementById("uploadButton").disabled = false;
}

// Display JSON content in a specified element
function displayJson(content, elementId) {
  const jsonOutput = document.getElementById(elementId);
  jsonOutput.textContent = JSON.stringify(content, null, 2);
  jsonOutput.style.display = "block";
}

// Handle file upload
async function handleFileUpload() {
  const jsonOutput = document.getElementById("jsonOutput");
  const fileContent = JSON.parse(jsonOutput.textContent);

  const ipfsHash = await uploadToIPFS(fileContent);
  console.log("Initial IPFS Hash:", ipfsHash);
  displayValue("Initial IPFS Hash", ipfsHash);
  updateProgressBar(25);

  
  
  const { encryptedHash, encryptionKey } = encryptIPFSHash(ipfsHash);
  console.log("Initial AES Key:", encryptionKey);

  displayValue("Initial AES Key", encryptionKey);
  updateProgressBar(50);

  displayValue("Encrypted IPFS Hash", encryptedHash);
  updateProgressBar(75);

  const publicKey = await getMetaMaskEncryptionPublicKey();
  const encryptedAESKey = encryptMessage(publicKey, encryptionKey);

  displayValue("Encrypted AES Key", encryptedAESKey);

  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];

  const tx = await fitnessContract.storeFitnessData(account, encryptedHash, encryptedAESKey);
  await tx.wait();

  updateProgressBar(100);

  alert("File uploaded and data stored successfully!");
  console.log("Encrypted IPFS Hash:", encryptedHash);
  console.log("Encrypted AES Key:", encryptedAESKey);

  // Enable the retrieve button
  document.getElementById("retrieveButton").disabled = false;
}

// Retrieve and decrypt data
async function retrieveAndDecryptData() {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];

  console.log("Account to retrieve from:", account);

  const userFitnessData = await fitnessContract.getUserFitnessData(account);
  const { ipfsHash, encryptedAESKey } = userFitnessData.at(-1); // To change: iterate through all users
  const decryptedAESKey = await decryptMessage(encryptedAESKey);
  console.log("Decrypted AES Key:", decryptedAESKey);
  displayValue("Decrypted AES Key", decryptedAESKey);
  
  const decryptedIPFSHash = CryptoJS.AES.decrypt(ipfsHash, decryptedAESKey).toString(CryptoJS.enc.Utf8);
  console.log("Decrypted IPFS Hash:", decryptedIPFSHash);
  displayValue("Decrypted IPFS Hash", decryptedIPFSHash);

  const fileContent = await retrieveFromIPFS(decryptedIPFSHash);

  console.log("Retrieved File Content:", fileContent);

  // Display JSON content
  displayJson(fileContent, "retrievedOutput");
}

// Display value in a specified element
function displayValue(label, value) {
  const uploadValues = document.getElementById("uploadValues");
  const valueElement = document.createElement("div");
  valueElement.textContent = `----------\n${label}: ${value}\n`;
  uploadValues.appendChild(valueElement);
  uploadValues.style.display = "inline-block";
}

// Hide values
function hideValues() {
  document.getElementById("uploadValues").style.display = "none";
  document.getElementById("uploadValues").innerHTML = "";
  document.getElementById("retrieveValues").style.display = "none";
  document.getElementById("retrieveValues").innerHTML = "";
}

// Update progress bar
function updateProgressBar(value) {
  const progressBar = document.getElementById("progressBar");
  progressBar.style.display = "block";
  progressBar.value = value;
  if (value === 100) {
    setTimeout(() => {
      progressBar.style.display = "none";
    }, 1000);
  }
}

// Event listeners
document.getElementById("fileInput").addEventListener("change", handleFileSelection);
document.getElementById("uploadButton").addEventListener("click", handleFileUpload);
document.getElementById("defaultButton").addEventListener("click", handleDefaultSelection);
document.getElementById("retrieveButton").addEventListener("click", retrieveAndDecryptData);

const connectButton = document.getElementById("connect");

connectButton.addEventListener("click", async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    console.log("Connected account:", account);
    document.getElementById("account-info").textContent = `Connected account: ${account}`;

    // Reset all fields and buttons
    document.getElementById("fileInput").value = "";
    document.getElementById("uploadButton").disabled = true;
    document.getElementById("retrieveButton").disabled = true;
    document.getElementById("jsonOutput").style.display = "none";
    document.getElementById("retrievedOutput").style.display = "none";
    hideValues();
    updateProgressBar(0);
  } else {
    console.error("MetaMask is not installed.");
  }
});

// Initialize
init();