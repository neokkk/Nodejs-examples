const util = require("util");
const crypto = require("crypto");

const dontuseme = util.deprecate((x, y) => {
    console.log(x + y);
}, "이 함수는 2018년 12월 부로 지원하지 않습니다.");

dontuseme(1, 2);
// 콜백 지옥
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


// promisify 이용
const randomBytesPromise = util.promisify(crypto.randomBytes);
const pbkdf2Promise = util.promisify(crypto.pbkdf2);

randomBytesPromise(64)
    .then((buf) => {
        const salt = buf.toString("base64");
        return pbkdf2Promise("nkpassword", salt, 338581, 64, "sha512");
    })
    .then((key) => {
        console.log("password", key.toString("base64"));
    })
    .catch((err) => {
        console.error(err);
    });


// async, await 이용
(async() => {
    const buf = await.randomBytesPromise(64);
    const salt = buf.toString("base64");
    const key = await.pbkdf2Promise("nkpassword", salt, 338581, 64, "sha512");
    console.log("password", key.toString("base64"));
})();