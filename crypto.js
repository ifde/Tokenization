// Import Web3.js
//import Web3 from "web3";
// import CryptoJS from "crypto-js";

// Encrypt IPFS Hash using AES encryption (256-bit)
function encryptIPFSHash(hash) {
    // Use the generateRandomAESKey function to generate the AES key
    const key = generateRandomAESKey().toString();

    const keyHex = CryptoJS.enc.Hex.parse(key).toString();

    // Create the config object (using CBC mode and PKCS7 padding)
    const cfg = {
        mode: CryptoJS.mode.CBC,          // Use CBC mode
        padding: CryptoJS.pad.Pkcs7      // Use PKCS7 padding
    };

    // AES encryption using CryptoJS
    const encrypted = CryptoJS.AES.encrypt(hash, keyHex, cfg).toString();

    return { encryptedHash: encrypted, encryptionKey: key };
}

// Decrypt IPFS Hash using AES decryption (256-bit)
function decryptIPFSHash(encryptedHash, encryptionKey) {
    // AES decryption using CryptoJS
    const keyHex = CryptoJS.enc.Hex.parse(encryptionKey).toString();
    const decrypted = CryptoJS.AES.decrypt(encryptedHash, keyHex);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

// Function to generate a random AES key (256 bits)
function generateRandomAESKey() {
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex); // Generate a 256-bit AES key
}

// Encrypt AES key with a public key (RSA encryption example) using Web Crypto API
async function encryptAESKey(publicKey, aesKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(aesKey);  // Convert AES key to bytes

    // Encrypt with RSA using the Web Crypto API
    const encryptedKey = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey,  // Assuming publicKey is a CryptoKey object
        data
    );

    return encryptedKey;
}

// Decrypt the encrypted AES key with a private key (RSA decryption example)
async function decryptAESKey(privateKey, encryptedAESKey) {
    const decryptedKey = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP",
        },
        privateKey,  // Assuming privateKey is a CryptoKey object
        encryptedAESKey
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedKey);
}

async function getMetaMaskPublicKey() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            return accounts[0]; // Return the first account
        } catch (error) {
            console.error("Error fetching MetaMask public key:", error);
        }
    } else {
        console.error("MetaMask is not installed!");
    }
}

// Function to encrypt AES key using MetaMask public key
async function encryptAESKeyWithMetaMask(publicKey, aesKey) {
    const encoder = new TextEncoder();
    const encodedKey = encoder.encode(aesKey); // Encode AES key as bytes

    // Encrypt AES key using the public key
    const encryptedAESKey = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        publicKey, // CryptoKey object representing the public key
        encodedKey
    );

    return encryptedAESKey;
}

// Function to decrypt AES key using MetaMask private key
async function decryptAESKeyWithMetaMaskPrivateKey(encryptedAESKey) {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request user to unlock MetaMask account
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];

            if (!account) {
                throw new Error("MetaMask account not found");
              }

            const signedMessage = await window.ethereum.request({
                method: "personal_sign",
                params: [encryptedAESKey, account],
              });
            
            console.log(signedMessage);

            return signedMessage; // Return the decrypted AES key
        } catch (error) {
            console.error("Error decrypting AES key:", error);
        }
    } else {
        console.error("MetaMask is not installed!");
    }
}

console.log(CryptoJS);

// Example usage
const hash = "ipfs://QmdgLWAEeZyknUnmVvfRKvgJQbfYuU7QxzPcEFYQ6zAytW/fitnessData.json"; // Replace with your IPFS hash
const result = encryptIPFSHash(hash);
console.log("Encrypted Hash:", result.encryptedHash);
console.log("Encryption Key:", result.encryptionKey);

const { encryptedHash, encryptionKey  } = result;
const originalHash = decryptIPFSHash(encryptedHash, encryptionKey);
console.log("Decrypted IPFS Hash:", originalHash);

// Export functions
export {
    generateRandomAESKey,
    encryptAESKey,
    decryptAESKey,
    getMetaMaskPublicKey,
    encryptAESKeyWithMetaMask,
    decryptAESKeyWithMetaMaskPrivateKey
};
