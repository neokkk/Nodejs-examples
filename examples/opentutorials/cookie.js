const http = require("http"),
  cookie = require("cookie");

http
  .createServer((req, res) => {
    let cookies = {};

    if (req.headers.cookie !== undefined) {
      cookies = cookie.parse(req.headers.cookie);
      console.log(cookies);
    }

    res.writeHead(200, {
      "Set-Cookie": [
        "yummy_cookie=choco",
        "tasty_cookie=strawberry",
        `Permanent=cookies; Max-Age=${60 * 60 * 24}`,
        "Secure=secure; Secure",
        "HttpOnly=httpOnly; HttpOnly",
        "Path=path; Path=/cookie",
        "Domain=domain; Domain=o2.org"
      ]
    });
    res.end("Cookies!");
  })
  .listen(3000);
