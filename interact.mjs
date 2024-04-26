import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const buildPath = path.resolve(currentDir, 'build');
const bytecodePath = path.join(buildPath, 'transactionDataBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

//read the json file in ./build/transacionAbi.json
const abiPath = path.join(buildPath, 'transactionAbi.json');
const contractAbi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
// Initialize web3 instance
const web3 = new Web3('http://localhost:7545'); // Update the URL with your Ethereum node URL

// Set up the contract instance
const contractAddress = fs.readFileSync('./build/transacionDataAddress.bin', 'utf-8'); // Replace with your deployed contract address
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Example function to store a new message
async function storeMessage(receiver, content) {
    // Send a transaction to the contract to store the message
    // const accounts = await web3.eth.getAccounts();

    // const sender = accounts[0]; // Assuming you want to use the first account
    const sender = "0x6221D320D0C704dCd2836beF935CdAb20AdE66A3";
    //Estimate gas required for the transaction
    const gasEstimateBigInt = await contract.methods.storeMessage(receiver, content).estimateGas({ from: sender });
    const gasEstimate = Number(gasEstimateBigInt); // Convert BigInt to number

    // Set gas limit to a value slightly higher than the estimated gas
    const gasLimit = Math.ceil(gasEstimate * 70); // Increase by 10%
    // Send transaction with gas limit
    await contract.methods.storeMessage(receiver, content).send({
        from: sender,
        gas: gasLimit,
    });
    console.log('Message stored successfully.');
}

// Example function to retrieve all messages sent by a specific sender
async function getMessagesSentBySender(sender) {
    // Call the contract's view function to retrieve messages
    const result = await contract.methods.getMessagesSentBySender(sender).call();
    const senders = result[0];
    const receivers = result[1];
    const contents = result[2];

    console.log('Messages sent by', sender);
    for (let i = 0; i < senders.length; i++) {
        console.log('Sender:', senders[i]);
        console.log('Receiver:', receivers[i]);
        console.log('Content:', contents[i]);
        console.log('------------------');
    }
}

// Example function to retrieve all messages received by a specific receiver
async function getMessagesReceivedByReceiver(receiver) {
    // Call the contract's view function to retrieve messages
    const result = await contract.methods.getMessagesReceivedByReceiver(receiver).call();
    const senders = result[0];
    const receivers = result[1];
    const contents = result[2];

    console.log('Messages received by', receiver);
    for (let i = 0; i < senders.length; i++) {
        console.log('Sender:', senders[i]);
        console.log('Receiver:', receivers[i]);
        console.log('Content:', contents[i]);
        console.log('------------------');
    }
}

// Example usage
storeMessage('0xA0D1BFeA7deCA07870ed0B5a5dc686a9b634CB78', 'Hello world!'); // Replace '0xReceiverAddress' with the receiver's address
getMessagesSentBySender('0xf5F9621d6f85D4184484Cd2f79e71E203d796B95'); // Replace '0xSenderAddress' with the sender's address
getMessagesReceivedByReceiver('0xA0D1BFeA7deCA07870ed0B5a5dc686a9b634CB78'); // Replace '0xReceiverAddress' with the receiver's address
