const http = require('http'),
      fs = require('fs'),
      url = require('url');

const app = http.createServer((req, res) => {
    let _url = req.url;
    const queryData = url.parse(_url, true).query,
          pathname = url.parse(_url, true).pathname;

    let title = queryData.id;

    if (pathname === '/') {
      if (title === undefined)
        title = 'Welcome';

      fs.readFile(`1_${title}.html`, 'utf-8', (err, data) => {
        if (data === undefined)
          data = 'Hello, Node.js!';

        const template = `
          <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              <li><a href="?id=HTML">HTML</a></li>
              <li><a href="?id=CSS">CSS</a></li>
              <li><a href="?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${data}</p>
          </body>
          </html>
          `;
        
        res.writeHead(200);
        res.end(template);
      });  
    } else {
      res.writeHead(404);
      res.end('Not Found');
  }             
});

app.listen(3000);