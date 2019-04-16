const fs = require('fs');

fs.readFile('1_sample.txt', 'utf-8', (err, data) => {
    if (err) throw err;

    console.log(data);
});