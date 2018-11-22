const fs = require("fs");

let data = fs.readFileSync("./readme.txt");

console.log("시작");
console.log("1번", data.toString());
data = fs.readFileSync("./readme.txt");
console.log("2번", data.toString());
data = fs.readFileSync("./readme.txt");
console.log("3번", data.toString());
console.log("끝");