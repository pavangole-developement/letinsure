import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const buildPath = path.resolve(currentDir,'build');
const bytecodePath = path.join(buildPath, 'transactionDataBytecode.bin');
const bytecode = fs.readFileSync(bytecodePath, 'utf8');

//read the json file in ./build/transacionAbi.json
const abiPath = path.join(buildPath, 'transactionAbi.json');
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

const myContract = new web3.eth.Contract(abi);
myContract.handleRevert = true;

async function deploy() {
    const providersAccounts = await web3.eth.getAccounts();
    const defaultAccount = providersAccounts[0];
    console.log('deployer account:', defaultAccount);

    const contractDeployer = myContract.deploy({
        data: '0x' + bytecode,
        arguments: [1],
    });

    const gas = await contractDeployer.estimateGas({
        from: defaultAccount,
    });
    console.log('estimated gas:', gas);

    try {
        const tx = await contractDeployer.send({
            from: defaultAccount,
            gas,
            gasPrice: 10000000000,
        });
        console.log('Contract deployed at address: ' + tx.options.address);

        const deployedAddressPath = path.join(buildPath, 'transacionDataAddress.bin');
        fs.writeFileSync(deployedAddressPath, tx.options.address);
    } catch (error) {
        console.error(error);
    }
}

deploy();
