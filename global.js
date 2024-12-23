/* 
This file contains contract address and ABI. 
It gets them automatically after deploying a contract using scripts/Deploy.ts
We then use these variables in API to connect to a deployed contract.
*/

export let CONTRACT_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
// export let CONTRACT_ABI = 
export let CONTRACT_ABI = [{"type":"event","anonymous":false,"name":"DataAdded","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"string","name":"ipfsHash","indexed":false},{"type":"uint256","name":"timestamp","indexed":false}]},{"type":"function","name":"clearUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[]},{"type":"function","name":"getUserFitnessData","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[{"type":"string[]","name":""}]},{"type":"function","name":"hello","constant":true,"stateMutability":"pure","payable":false,"inputs":[],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"storeFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"string","name":"ipfsHash"}],"outputs":[]}];