// Build bundle.js file first
// npx browserify web3.js -o dist/bundle.js
// Then run the code


const sigUtil = require('@metamask/eth-sig-util')
const Buffer = require('buffer/').Buffer

let account;

// Get public key from MetaMask
async function getMetaMaskEncryptionPublicKey() {
  try {
    const provider = window.ethereum
    const accounts = await provider.enable()
    account = accounts[0];
    // Use the MetaMask provider directly to call `eth_getEncryptionPublicKey`
    const publicKey = await provider.request({
      method: "eth_getEncryptionPublicKey",
      params: [account], // The account to get the encryption key for
    });
    return publicKey;
  } catch (error) {
    console.error("Error getting MetaMask encryption public key:", error);
    throw error; // Rethrow the error for handling elsewhere
  }
}

// Encrypt message
function encryptMessage(publicKey, message) {
  try {
    console.log("Public Key Used for Ecnryption:", publicKey);
    const buf = Buffer.from(
      JSON.stringify(
        sigUtil.encrypt({
          publicKey: publicKey,  // Your Base64 public key
          data: message,         // The message to encrypt
          version: 'x25519-xsalsa20-poly1305'  // Encryption version
        })
      ),
      'utf8'
    )

    encryptedHex = '0x' + buf.toString('hex');

    console.log("Encrypted Message:", encryptedHex);
    return encryptedHex;
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
    account = accounts[0];

    const decryptedMessage = await provider.request({"method": "eth_decrypt", "params": [encryptedMessage, account]});
    console.log("Decrypted Message:", decryptedMessage);
    return decryptedMessage;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}

// Example usage
async function performEncryptionDecryption() {
  const publicKey = await getMetaMaskEncryptionPublicKey();
  console.log("Public Encryption Key:", publicKey);

  const message = "Hello, MetaMask!";
  console.log("Original Message:", message);

  const encryptedMessage = encryptMessage(publicKey, message);
  console.log("Encrypted Message:", encryptedMessage);

  const decryptedMessage = await decryptMessage( encryptedMessage);
  console.log("Decrypted Message:", decryptedMessage);
}

const connectButton = document.getElementById("connect");
const encryptDecryptButton = document.getElementById("encrypt-decrypt");

connectButton.addEventListener("click", async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    console.log("Connected account:", account);
  } else {
    console.error("MetaMask is not installed.");
  }
});

encryptDecryptButton.addEventListener("click", async () => {
  await performEncryptionDecryption();
});