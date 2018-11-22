const url = require("url");

// WHATWG
const URL = url.URL;
const myURL = new URL("http://www.gilbut.co.kr/");

console.log("new URL() : ", myURL);
console.log("url.format() : ", url.format(myURL));
console.log("url.parse() : ", url.parse(myURL));