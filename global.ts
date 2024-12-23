/* 
This file contains contract address and ABI. 
It gets them automatically after deploying a contract using scripts/Deploy.ts
We then use these variables in API to connect to a deployed contract.
*/

export let CONTRACT_ADDRESS: string;
export let CONTRACT_ABI: any;

export function setContractDetails(address: string, abi: any) {
  CONTRACT_ADDRESS = address;
  CONTRACT_ABI = abi;
}