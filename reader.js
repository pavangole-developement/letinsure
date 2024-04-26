const fs = require('fs');

// Function to read the first line from a file
function readFirstLine(filePath) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
        let buffer = '';
        let isFirstLine = true;

        stream.on('data', (chunk) => {
            buffer += chunk;
            const lines = buffer.split('\n');

            if (isFirstLine && lines.length > 1) {
                isFirstLine = false;
                const firstLine = lines[0];
                const parts = firstLine.split(':');
                if (parts.length === 2) {
                    const key = parts[0].trim();
                    const value = parts[1].trim();
                    resolve({ key, value });
                } else {
                    reject(new Error('Invalid format'));
                }
                // Remove the first line from buffer
                buffer = buffer.slice(lines[0].length + 1);
                stream.destroy();
            }
        });

        stream.on('error', (error) => {
            reject(error);
        });

        stream.on('end', () => {
            reject(new Error('File contains only one line or is empty'));
        });
    });
}

// Function to remove the first line from a file
function removeFirstLine(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const lines = data.split('\n').slice(1).join('\n');
                fs.writeFile(filePath, lines, { encoding: 'utf-8' }, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

// Usage
const filePath = 'private_keys.txt'; // Replace with your file path
readFirstLine(filePath)
    .then(({ key, value }) => {
        console.log('Key:', key);
        console.log('Value:', value);
        return removeFirstLine(filePath);
    })
    .then(() => {
        console.log('First line removed from the file.');
    })
    .catch((error) => {
        console.error(error);
    });
