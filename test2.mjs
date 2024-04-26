import { Web3 } from 'web3';

const web3 = new Web3('http://localhost:7545');

//this will create an array `Wallet` with 1 account with this privateKey
//it will generate automatically a public key for it
//make sure you have funds in this accounts
const wallet = web3.eth.accounts.wallet.add('0x9b94d4231c633d21ba913f73d04e80eb16a75e2c6e5ce0d7711cce98763561c5');

const _to = '0xA32f736a1Cf3a381Df199213F12AB95225DF5158';
const _value = web3.utils.toWei('0.001', 'ether');

//the `from` address in the transaction must match the address stored in our `Wallet` array
//that's why we explicitly access it using `wallet[0].address` to ensure accuracy
const receipt = await web3.eth.sendTransaction({
  from: wallet[0].address,
  to: _to,
  value: _value,
});
//if you have more than 1 account, you can change the address by accessing to another account
//e.g, `from: wallet[1].address`

console.log('Tx receipt:', receipt);