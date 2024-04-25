import { Web3 } from 'web3';
// Connect to Ganache (change the provider URL if Ganache is running on a different address)
const web3 = new Web3('http://localhost:7545');

async function sendETH(fromAccount, toAccount, amount) {
  try {
    // Convert amount to wei (1 ETH = 10^18 wei)
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

    // Get list of accounts available in Ganache
    const accounts = await web3.eth.getAccounts();

    // Check if sender's account has sufficient balance
    const balance = await web3.eth.getBalance(accounts[fromAccount]);
    if (balance < amountInWei) {
      throw new Error('Insufficient balance in sender account');
    }

    // Create transaction object
    const txObject = {
      from: accounts[fromAccount],
      to: accounts[toAccount],
      value: amountInWei,
    };

    // Send transaction
    const receipt = await web3.eth.sendTransaction(txObject);
    console.log('Transaction receipt:', receipt);
    console.log(`Successfully sent ${amount} ETH from ${accounts[fromAccount]} to ${accounts[toAccount]}`);
  } catch (error) {
    console.error('Error sending ETH:', error);
  }
}

// Example usage: send 0.1 ETH from account at index 0 to account at index 1
const senderAccountIndex = 0;
const receiverAccountIndex = 1;
const amountToSend = 0.1; // Amount of ETH to send

sendETH(senderAccountIndex, receiverAccountIndex, amountToSend);
