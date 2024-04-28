const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

const currentDir = path.dirname(__filename);
const buildPath = path.resolve(currentDir, 'build');
const bytecodePath = path.join(buildPath, 'transactionDataBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

// Read the JSON file in ./build/transacionAbi.json
const abiPath = path.join(buildPath, 'transactionAbi.json');
const contractAbi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

// Initialize web3 instance
const web3 = new Web3('http://localhost:7545'); // Update the URL with your Ethereum node URL

// Set up the contract instance
const contractAddress = fs.readFileSync('./build/transacionDataAddress.bin', 'utf-8'); // Replace with your deployed contract address
const contract = new web3.eth.Contract(contractAbi, contractAddress);

// Example function to store a new message
async function storeMessage(sender, receiver, content) {
    // Estimate gas required for the transaction
    const gasEstimateBigInt = await contract.methods.storeMessage(receiver, content).estimateGas({ from: sender });
    const gasEstimate = Number(gasEstimateBigInt); // Convert BigInt to number

    // Set gas limit to a value slightly higher than the estimated gas
    const gasLimit = Math.ceil(gasEstimate * 10); // Increase by 10%
    const gasPriceinWei = await web3.eth.getGasPrice();
    const gasPrice = Number(gasPriceinWei); // Convert from Wei to Ether
    const totalCostInEther = (gasLimit * gasPrice) / 1e18; // Convert gas to Ether

    console.log('Total cost in Ether:', totalCostInEther);
    // Send transaction with gas limit
    await contract.methods.storeMessage(receiver, content).send({
        from: sender,
        gas: gasLimit,
    });
    console.log('Message stored successfully.');
    return "Message sent successfully";
}

// Example function to retrieve all messages sent by a specific sender
async function getMessagesSentBySender(sender) {
    // Call the contract's view function to retrieve messages
    const result = await contract.methods.getMessagesSentBySender(sender).call();
    const senders = result[0];
    const receivers = result[1];
    const contents = result[2];

    console.log('Messages sent by', sender);
    const combinedData = [];

    for (let i = 0; i < senders.length; i++) {
        const data = {
            receiver: receivers[i],
            content: contents[i]
        };
        combinedData.push(data);
    }

    console.log(JSON.stringify(combinedData, null, 2));
    return JSON.stringify(combinedData, null, 2);
}

// Example function to retrieve all messages received by a specific receiver
async function getMessagesReceivedByReceiver(receiver) {
    // Call the contract's view function to retrieve messages
    const result = await contract.methods.getMessagesReceivedByReceiver(receiver).call();
    const senders = result[0];
    const receivers = result[1];
    const contents = result[2];

    console.log('Messages received by', receiver);
    const combinedData = [];

    for (let i = 0; i < senders.length; i++) {
        const data = {
            sender: senders[i],
            content: contents[i]
        };
        combinedData.push(data);
    }

    console.log(JSON.stringify(combinedData, null, 2));
    return JSON.stringify(combinedData, null, 2);
}
// Example usage
// var sender = '0xC107faB5Ca67e3B2D924A2911A617B04ca2C5adF'
// var receiver = '0x2Ac3a1EC7024A085A21cd09Ca353FcA4A5FEa7eA'
// var content = "abra ka dabra"
//storeMessage(sender, receiver, content); // Replace '0xReceiverAddress' with the receiver's address
//getMessagesSentBySender(sender); // Replace '0xSenderAddress' with the sender's address
getMessagesReceivedByReceiver("0xCC68289f79B68dF36bA9C62FB977c1b6e500B9B4"); // Replace '0xReceiverAddress' with the receiver's address
// Exporting functions
module.exports = { storeMessage, getMessagesSentBySender, getMessagesReceivedByReceiver };
