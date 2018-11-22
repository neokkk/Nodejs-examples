const crypto = require("crypto");

// 단방향 암호화(복호화 x)
// sha512 방식으로 암호화 해 비밀번호를 설정하라.
console.log(crypto.createHash("sha512").update("nk").digest("base64"));

