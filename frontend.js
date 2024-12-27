import fs from "fs";
import path from "path";

async function testStore() {

  const fileBuffer = fs.readFileSync("fitnessData.json");
  const fileData = fileBuffer.toString("base64");

  const userId = "3"; // Replace with a valid user ID

  console.log("Base64 encoded file: ", fileData);

  const response = await fetch(`http://localhost:3000/store/${userId}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          file: fileData, // Sending base64 encoded JSON file
      })
  });

  const data = await response.json();
  if (response.ok) {
      console.log("Store Success:", data);
  } else {
      console.error("Store Error:", data);
  }
}

async function testRetrieve() {
  const userId = "3"; // Replace with a valid user ID

  // Send a GET request to the '/retrieve' endpoint to fetch data
  const response = await fetch(`http://localhost:3000/retrieve/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Retreive Success:", data);
  } else {
    console.error("Retreive Error:", data);
  }
}

// Test `clearUserFitnessData` functionality
async function testClear() {
  const userId = "3"; // Replace with a valid user ID

  const response = await fetch(`http://localhost:3000/clear/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Clear Success:", data);
  } else {
    console.error("Clear Error:", data);
  }
}

// Test `deleteSpecificEntry` functionality
async function testDeleteSpecificEntry() {
  const userId = "3"; // Replace with a valid user ID
  const index = 0; // Replace with a valid index to delete

  const response = await fetch(`http://localhost:3000/delete/${userId}/${index}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Delete Entry Success:", data);
  } else {
    console.error("Delete Entry Error:", data);
  }
}

// Test `updateSpecificEntry` functionality
async function testUpdateSpecificEntry() {
  const userId = "3"; // Replace with a valid user ID
  const index = 0; // Replace with a valid index to update
  const newIpfsHash = "ipfs://QmdgLWAEeZyknUnmVvfRKvgJQbfYuU7QxzPcEFYQ6zAytW/fitnessData.json"; // Replace with a valid IPFS hash

  const response = await fetch(`http://localhost:3000/update/${userId}/${index}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ipfsHash: newIpfsHash,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Update Entry Success:", data);
  } else {
    console.error("Update Entry Error:", data);
  }
}

await testStore();
await testRetrieve();
await testClear();
await testStore();
await testDeleteSpecificEntry();
await testStore();
await testUpdateSpecificEntry();