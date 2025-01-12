# Tokenization
Term project "Data tokenization".  
Functionality: 
1. Connect to MetaMask  
2. Upload user JSON data to IPFS  
3. Encrypt IPFS Hash from the previous step with AES key  
4. Ecnrypt AES key with MetaMask public key  
5. Store encrypted IPFS Hash and AES key on the blockchain  
6. Retrieve user's encrypted IPFS Hash and AES key from the blockchain  
7. Decrypt AES key with MetaMask private key  
8. Decrypt IPFS Hash from the previous step with decrypted AES key  
9. Retrieve the stored JSON data  
10. Display all the steps on the page  

Or in a nutshell:  
1. Connects to MetaMask  
2. Stores user's JSON data on the blockchain in an encrypted way  
3. Retirieves user's JSON data from the blockchain and decrypts it  

Here's a quick video to show the funtionality (doesn't have sound):  
<video controls src="Functionality.mp4" title="Title"></video>

# Local set up guide 

1. Clone repository locally:  
`git clone https://github.com/ifde/Tokenization.git`  

2. Install the requirments:  
`yarn install`  

3. Start a local blockchain node:  
`npx hardhat node`  

You will see a list of available wallets, pick the first one (or any other one if you wish)  
Copy its Private Key and insert into `WALLET_PRIVATE_KEY` in `.env`  

Note: for following commands, open up a new terminal in VSCode.  
To kill the proccess, use CTRL+C  

4. Deploy the contract on a local blockchain:  
`npx hardhat run scripts/Deploy.js --network localhost`  
You will see deployed contract's address and ABI. 
Insert `CONTRACT_ABI` into `main.js` and `CONTRACT_ADDRESS` into `.env`  

5. Create an account on thirdweb and create a project there  
Add your thridweb Client ID in a THIRDWEB_CLIENT_ID variable in '.env'   

6. Create / update a bundle file after making changes in `main.js` file.  
`yarn run webpack`  

Basically, it creates a file that contains all the code from the main.js file and its dependencies.  
And it can run directly in the browser without Node.js.  
We include bundle.js file in the index.html file.  

Note: make sure to update your bundle file each time after making changes in `main.js` file.  

7. Start a local https-server:  
`npx http-server`  
You will see something like `http://127.0.0.1:8080` - paste in your browser and you're all done! 
Now you can play around with it.  

Note: for following commands, open up a new terminal in VSCode.  
To kill the proccess, use CTRL+C  



