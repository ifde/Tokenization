const sigUtil = require('@metamask/eth-sig-util'); // Import the module

// Example usage of sigUtil
const encryptedMessage = sigUtil.encrypt({
  publicKey: 'your-public-key',
  data: 'Hello, world!',
  version: 'x25519-xsalsa20-poly1305'
});

console.log(encryptedMessage);
