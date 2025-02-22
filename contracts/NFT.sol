// SPDX-License-Identifier: MIT
// THIS IS THE CURRENT VERSION OF THE CONTRACT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FitnessDataNFT is ERC721URIStorage, Ownable {
    struct FitnessData {
        string ipfsHash; // Encrypted IPFS hash of the JSON data
        string encryptedAESKey; // Encrypted AES key
        uint256 timestamp; // Time when the data was added
    }

    // Mapping to store data by user ID (public wallet key)
    mapping(string => FitnessData[]) private userFitnessData;

    // Array with user IDs
    string[] private userIds;

    // Counter for token IDs
    uint256 private _tokenIdCounter;

    // constructor() ERC721("FitnessDataNFT", "FDNFT") {}

    // constructor() Ownable(msg.sender) {}

    constructor() Ownable(msg.sender) ERC721("FitnessDataNFT", "FDNFT") {}

    event DataAdded(string userId, string ipfsHash, string encryptedAESKey, uint256 timestamp);
    event DataDeleted(string userId, uint256 index);
    event DataUpdated(string userId, uint256 index, string newIpfsHash, string newEncryptedAESKey);

    // Function to store fitness data
    function storeFitnessData(string memory userId, string memory ipfsHash, string memory encryptedAESKey) public {
        require(bytes(userId).length > 0, "User ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(encryptedAESKey).length > 0, "Encrypted AES key cannot be empty");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, ipfsHash);

        FitnessData memory newData = FitnessData({
            ipfsHash: ipfsHash,
            encryptedAESKey: encryptedAESKey,
            timestamp: block.timestamp
        });

        userFitnessData[userId].push(newData);

        // Add userId to userIds array if it's the first time storing data for this user
        if (userFitnessData[userId].length == 1 && !checkUserExists(userId)) {
            userIds.push(userId);
        }

        emit DataAdded(userId, ipfsHash, encryptedAESKey, block.timestamp);
    }

    // Checks if the user already exists
    function checkUserExists(string memory userId) public view returns (bool) {
        for (uint i = 0; i < userIds.length; i++) {
            if (keccak256(abi.encodePacked(userIds[i])) == keccak256(abi.encodePacked(userId))) {
                return true;
            }
        }
        return false;
    }

    // Return data of a specific user
    function getUserFitnessData(string memory userId) public view returns (FitnessData[] memory) {
        return userFitnessData[userId];
    }

    // Lists all user IDs
    function listAllUsers() public view returns (string[] memory) {
        return userIds;
    }

    // Clears all data entries of a specific user
    function clearUserFitnessData(string memory userId) public {
        delete userFitnessData[userId];

        // Remove userId from userIds array
        for (uint i = 0; i < userIds.length; i++) {
            if (keccak256(abi.encodePacked(userIds[i])) == keccak256(abi.encodePacked(userId))) {
                userIds[i] = userIds[userIds.length - 1];
                userIds.pop();
                break;
            }
        }
    }

    // Deletes a specific entry from userFitnessData
    function deleteUserFitnessData(string memory userId, uint256 index) public {
        require(index < userFitnessData[userId].length, "Invalid index");

        for (uint i = index; i < userFitnessData[userId].length - 1; i++) {
            userFitnessData[userId][i] = userFitnessData[userId][i + 1];
        }
        userFitnessData[userId].pop(); // Remove the last element

        emit DataDeleted(userId, index);
    }

    // Updates a specific entry in userFitnessData
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

    // Override required functions from ERC721URIStorage
    // function _burn(uint256 tokenId) internal {
    //     super._burn(tokenId);
    // }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}


// What is super 
// Why use AES key 
// Tokens 