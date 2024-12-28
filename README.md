# Tokenization
Term project "Data tokenization". 

# Local set up guide 

1. Clone repository locally:  
`git clone https://github.com/ifde/Tokenization.git`  

2. Install the requirments:  
`yarn install`  

3. Start a local blockchain node:  
`npx hardhat node`  

You will see a list of available wallets, pick the first one (or any other one if you wish)  
Copy its Private Key and insert into `WALLET_PRIVATE_KEY` in `main.js`  

Note: for following commands, open up a new terminal in VSCode.  
To kill the proccess, use CTRL+C  

4. Deploy the contract on a local blockchain:  
`npx hardhat run scripts/Deploy.js --network localhost`  
You will see deployed contract's address and ABI. 
Insert them into `main.js` (`CONTRACT_ADDRESS` and `CONTRACT_ABI`, respectively)  

5. Start a local https-server:  
`npx http-server`  
You will see something like `http://127.0.0.1:8080` - paste in your browser and you're all done! 
Now you can play around with it.  

Note: for following commands, open up a new terminal in VSCode.  
To kill the proccess, use CTRL+C  

