const fs = require('fs');

// Read File Synchronous
console.log('A');
const resultSync = fs.readFileSync('sample2.txt', 'utf-8');

console.log(resultSync);
console.log('C');

// Read File Asyncronous
console.log('A');
fs.readFile('sample2.txt', 'utf-8', (err, result) => {
    console.log(result);
});
console.log('C');