import { createThirdwebClient } from "thirdweb";

import { upload, download } from "thirdweb/storage";

import fs from "fs";

const client = createThirdwebClient({ clientId: "3f7ea9dbfcdc8079c39087ed3a4ebfd0" });
 
//const uris = await upload({
//  client,
//  files: [new File(["hello world"], "hello.txt")],
//});

const filePath = "fitnessData.json"

const jsonFile = new File([fs.readFileSync(filePath)], "fitnessData.json", {
    type: "application/json",
  });

const uris = await upload({
    client,
    files: [jsonFile],
  });

console.log(uris);

const file = await download({
    client,
    uri: uris,
  });

const jsonContent = await file.text(); // Converts the file's content to a string

// Parse the string as JSON
const jsonData = JSON.parse(jsonContent);

console.log("JSON Data:", jsonData);

const fitnessData = {
    session_id: "RUN_20240101_001",
    user_id: "USER_001",
    start_time: "2024-01-01T18:00:00Z",
    end_time: "2024-01-01T18:45:00Z",
    summary: {
        total_distance: 5920,
        duration_seconds: 2700,
        average_pace: 7.36,
        average_heart_rate: 142,
        total_calories: 385,
        elevation_gain: 64
    }
};