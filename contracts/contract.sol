// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FitnessDataStorage {
    struct FitnessData {
        string ipfsHash; // Encrypted IPFS hash of the JSON data
        string encryptedAESKey; // Encrypted AES key
        uint256 timestamp; // When the data was added
    }

    // Mapping to store data by user ID
    mapping(string => FitnessData[]) private userFitnessData;

    event DataAdded(string userId, string ipfsHash, string encryptedAESKey, uint256 timestamp);
    event DataDeleted(string userId, uint256 index);
    event DataUpdated(string userId, uint256 index, string newIpfsHash, string newEncryptedAESKey);

    // Function to store fitness data
    function storeFitnessData(string memory userId, string memory ipfsHash, string memory encryptedAESKey) public {
        require(bytes(userId).length > 0, "User ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(encryptedAESKey).length > 0, "Encrypted AES key cannot be empty");

        // Create a new FitnessData entry
        FitnessData memory newData = FitnessData({
            ipfsHash: ipfsHash,
            encryptedAESKey: encryptedAESKey,
            timestamp: block.timestamp
        });

        // Append to the user's data array
        userFitnessData[userId].push(newData);

        emit DataAdded(userId, ipfsHash, encryptedAESKey, block.timestamp);
    }

    function getUserFitnessData(string memory userId) public view returns (FitnessData[] memory) {
        return userFitnessData[userId];
    }

    function clearUserFitnessData(string memory userId) public {
        delete userFitnessData[userId];
    }

    // Function to delete a specific entry from userFitnessData
    function deleteUserFitnessData(string memory userId, uint256 index) public {
        require(index < userFitnessData[userId].length, "Invalid index");

        // Shift the elements to remove the entry at the specified index
        for (uint i = index; i < userFitnessData[userId].length - 1; i++) {
            userFitnessData[userId][i] = userFitnessData[userId][i + 1];
        }
        userFitnessData[userId].pop(); // Remove the last element

        emit DataDeleted(userId, index);
    }

    // Function to update a specific entry in userFitnessData
    function updateUserFitnessData(string memory userId, uint256 index, string memory newIpfsHash, string memory newEncryptedAESKey) public {
        require(index < userFitnessData[userId].length, "Invalid index");
        require(bytes(newIpfsHash).length > 0, "New IPFS hash cannot be empty");
        require(bytes(newEncryptedAESKey).length > 0, "New encrypted AES key cannot be empty");

        // Update the entry at the specified index
        userFitnessData[userId][index].ipfsHash = newIpfsHash;
        userFitnessData[userId][index].encryptedAESKey = newEncryptedAESKey;
        userFitnessData[userId][index].timestamp = block.timestamp; // Update timestamp

        emit DataUpdated(userId, index, newIpfsHash, newEncryptedAESKey);
    }

    // Test function
    function hello() public pure returns (string memory) {
        return "Hello, Hardhat!";
    }
}