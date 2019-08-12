const crypto = require("crypto");

// 암호화(createCipher)
// utf8 평문을 base64 암호문으로 변경하라
const cipher = crypto.createCipher("aes-256-cbc", "열쇠");
let result = cipher.update("nkpassword", "utf8", "base64");
result += cipher.final("base64");

console.log("암호", result);

// 복호화(똑같은 알고리즘, 똑같은 key)(createDecipher)
// base64 암호문을 utf8 평문으로 변경하라
const decipher = crypto.createDecipher("aes-256-cbc", "열쇠");
let result2 = decipher.update(result, "base64", "utf-8");
result2 += decipher.final("utf8");

console.log("평문", result2);