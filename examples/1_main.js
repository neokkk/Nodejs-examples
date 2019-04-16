const http = require('http'),
      fs = require('fs'),
      url = require('url');

const app = http.createServer(function(req, res) {
    let _url = req.url;
    const queryData = url.parse(_url, true).query;
    let title = queryData.id;

    if (_url === '/')
        title = 'Welcome';

    if (_url === '/favicon.ico')
        return res.writeHead(404);

    res.writeHead(200);
    fs.readFile(`1_${title}.html`, 'utf-8', (err, data) => {
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

      res.end(template);
    });

    
});

app.listen(3000);