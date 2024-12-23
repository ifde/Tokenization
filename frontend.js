import fs from "fs";
import path from "path";

async function testStore() {

  const fileBuffer = fs.readFileSync("fitnessData.json");
  const fileData = fileBuffer.toString("base64");

  const userId = "3"; // Replace with a valid user ID

  console.log("Base64 encoded file: ", fileData);

  const response = await fetch("http://localhost:3000/store", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          userId: userId,
          file: fileData // Sending base64 encoded JSON file
      })
  });

  const data = await response.json();
  if (response.ok) {
      console.log("Store Success:", data);
  } else {
      console.error("Store Error:", data);
  }
}

await testStore();

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

testRetrieve();