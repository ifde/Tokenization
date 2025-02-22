require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY } = window.process.env;

module.exports = {
  solidity: "0.8.20", // or your preferred Solidity version
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [PRIVATE_KEY],
    },
    localhost: {
      url: "http://localhost:8545",
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]  // Private key for a local account 0
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 21,
  },
};