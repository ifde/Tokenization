import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function deploy() {
    const HelloWorld = await ethers.getContractFactory("FitnessDataStorage"); // like a class
    const hello = await HelloWorld.deploy();
    console.log(hello.getAddress());
    return hello;
}

// Helper to interact with the deployed contract
async function sayHello(hello: any) {
    console.log("Say Hello:", await hello.hello());
}

deploy().then(sayHello).catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
