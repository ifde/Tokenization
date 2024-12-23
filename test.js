import { create } from 'ipfs-http-client';

const ipfs = create({ host: 'dweb.link', port: 443, protocol: 'https' });

async function uploadToIPFS() {
    const data = 'Hello IPFS from Node.js!';
    const result = await ipfs.add(data);
    console.log('IPFS Hash:', result.path);
}

uploadToIPFS();

// ipfs daemon - start an ipfs server so that you can take your node online and interact with the IPFS network
// ps aux | grep ipfs - to find running deamons
// kill 12345 - to kill the process of a running daemon 