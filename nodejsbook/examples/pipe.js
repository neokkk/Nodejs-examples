const fs = require("fs");
const zlib = require("zlib");

const zlibStream = zlib.createGzip();
const readStream = fs.createReadStream("readme3.txt");
const writeStream = fs.createWriteStream("writeme3.txt");

readStream.pipe(zlibStream).pipe(writeStream);

// const readStream2 = fs.copyFile("./readme3.txt", "./writeme3.txt", (err) => {
//     console.log(err);
// });