import solc from 'solc';
import path from 'path';
import fs from 'fs';

const contractFolder = 'contracts'; // Folder containing Solidity contract
const fileName = 'recordsData.sol';
const contractName = path.parse(fileName).name;

// Resolve path to Solidity contract based on current module URL
const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const contractPath = path.resolve(currentDir, contractFolder, fileName);
console.log(contractPath);
// Read the Solidity source code from the file system
const sourceCode = fs.readFileSync(contractPath, 'utf8');

// solc compiler config
const input = {
    language: 'Solidity',
    sources: {
        [fileName]: {
            content: sourceCode,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

// Compile the Solidity code using solc
const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

// Check for compilation errors
if (compiledCode.errors) {
    console.error('Compilation errors:');
    compiledCode.errors.forEach((error) => {
        console.error(error.formattedMessage);
    });
    process.exit(1); // Exit with error status
}
console.log('Compiled Code:\n', compiledCode);

// Get the bytecode from the compiled contract
const bytecode = compiledCode.contracts['recordsData.sol'].MedicalAppointment.evm.bytecode.object;
const buildpath = path.resolve('build');
// Write the bytecode to a new file
console.log('Build Path:', buildpath);
const bytecodePath = path.resolve(buildpath, 'recordsDataBytecode.bin');
fs.writeFileSync(bytecodePath, bytecode);

// Log the compiled contract bytecode to the console
console.log('Contract Bytecode:\n', bytecode);

// Get the ABI from the compiled contract
const abi = compiledCode.contracts[fileName].MedicalAppointment.abi;

// Write the Contract ABI to a new file
const abiPath = path.resolve(buildpath, 'recordsAbi.json');
fs.writeFileSync(abiPath, JSON.stringify(abi, null, '\t'));

// Log the Contract ABI to the console
console.log('Contract ABI:\n', abi);
