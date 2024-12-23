// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FitnessDataStorage {
    struct FitnessData {
        string ipfsHash; // IPFS hash of the JSON data
        uint256 timestamp; // When the data was added
    }

    // Mapping to store data by user ID
    mapping(string => FitnessData[]) private userFitnessData;

    event DataAdded(string userId, string ipfsHash, uint256 timestamp);

    // Function to store fitness data
    function storeFitnessData(string memory userId, string memory ipfsHash) public {
        require(bytes(userId).length > 0, "User ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        // Create a new FitnessData entry
        FitnessData memory newData = FitnessData({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp
        });

        // Append to the user's data array
        userFitnessData[userId].push(newData);

        emit DataAdded(userId, ipfsHash, block.timestamp);
    }

    function getUserFitnessData(string memory userId) public view returns (string[] memory) {
    string[] memory ipfsHashes = new string[](userFitnessData[userId].length);
    for (uint i = 0; i < userFitnessData[userId].length; i++) {
        ipfsHashes[i] = userFitnessData[userId][i].ipfsHash;
    }
    return ipfsHashes;
    }

    function clearUserFitnessData(string memory userId) public {
    delete userFitnessData[userId];
    }

    function hello() public pure returns (string memory) {
        return "Hello, Hardhat!";
    }
}

// Deploy with 
// Locally: npx hardhat run scripts/Deploy.js --network localhost
// Globally: npx hardhat run scripts/Deploy.ts --network bscTestnet 