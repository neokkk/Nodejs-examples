const crypto = require("crypto");

crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString("base64");
    console.log("salt", salt);
    console.time("암호화");

    // iteration은 1초정도가 걸릴 때 까지 설정해주는 것이 좋다.
   crypto.pbkdf2("nkpassword", salt, 338581, 64, "sha512", (err, key) => {
        console.log("password", key.toString("base64"));
        console.timeEnd("암호화");
    });
});

crypto.createHash("sha512").update("비밀번호").digest("base64");

// 자주 사용되는 암호화 알고리즘
// bcrypt, scrypt ...