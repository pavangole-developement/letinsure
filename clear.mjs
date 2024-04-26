import { compareSync } from 'bcrypt';
import fs from 'fs';

//read keys.json
const keys = JSON.parse(fs.readFileSync('./keys.json', 'utf8'));
//list all the keys in the keys.json
//store the private keys in private_keys.txt remove the brackets and quotes
const privateKeys = keys['private_keys'];
console.log('Private Keys:', privateKeys);
let stringData = '';
for (const key in privateKeys) {
  stringData += `'${key}': '${privateKeys[key]}',\n`;
}

// Remove the last comma and newline character
stringData = stringData.slice(0, -2);
fs.writeFileSync('./private_keys.txt', stringData);