const path = require("path");

console.log(path.dirname(__filename));
console.log(path.extname(__filename));
console.log(path.basename(__filename));

// <-> path.format
console.log(path.parse(__filename));
console.log(path.normalize("user/nk/documents/webstorm\\"));

// path.isAbsolute (boolean)
// path.relative (relative address)

// 절대 경로 무시하고 합침
console.log(path.join(__dirname, "..", "..", "/users", ".", "nk"));

// 절대 경로 고려하고 합침
console.log(path.resolve(__dirname, "..", "..", "/users", ".", "nk"));