/* 
This file contains contract address and ABI. 
It gets them automatically after deploying a contract using scripts/Deploy.ts
We then use these variables in API to connect to a deployed contract.
*/

export let CONTRACT_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// export let CONTRACT_ABI = 
export let CONTRACT_ABI = [{"type":"event","anonymous":false,"name":"DataAdded","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"string","name":"ipfsHash","indexed":false},{"type":"string","name":"encryptedAESKey","indexed":false},{"type":"uint256","name":"timestamp","indexed":false}]},{"type":"event","anonymous":false,"name":"DataDeleted","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false}]},{"type":"event","anonymous":false,"name":"DataUpdated","inputs":[{"type":"string","name":"userId","indexed":false},{"type":"uint256","name":"index","indexed":false},{"type":"string","name":"newIpfsHash","indexed":false},{"type":"string","name":"newEncryptedAESKey","indexed":false}]},{"type":"function","name":"clearUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[]},{"type":"function","name":"deleteUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"}],"outputs":[]},{"type":"function","name":"getUserFitnessData","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"string","name":"userId"}],"outputs":[{"type":"tuple[]","name":"","components":[{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"},{"type":"uint256","name":"timestamp"}]}]},{"type":"function","name":"hello","constant":true,"stateMutability":"pure","payable":false,"inputs":[],"outputs":[{"type":"string","name":""}]},{"type":"function","name":"storeFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"string","name":"ipfsHash"},{"type":"string","name":"encryptedAESKey"}],"outputs":[]},{"type":"function","name":"updateUserFitnessData","constant":false,"payable":false,"inputs":[{"type":"string","name":"userId"},{"type":"uint256","name":"index"},{"type":"string","name":"newIpfsHash"},{"type":"string","name":"newEncryptedAESKey"}],"outputs":[]}];


// Token - a digital asset. 
// ERC-20 - fungible tokens (can be exchanged for another token of the same type)
// ERC-721 - non-fungible tokens (unique tokens)


