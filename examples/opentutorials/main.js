const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      qs = require('querystring');

const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query,
          pathname = url.parse(_url, true).pathname;

    let title = queryData.id,
        fileList = '',
        btn = '';

    function renderHTML(data) {
      fs.readdir('./o_data', (err, list) => {

        for (let i = 0; i < list.length; i++) {
          fileList += `<li><a href='/?id=${list[i]}'>${list[i]}</a></li>`;
        }
      });

      fs.readFile(`o_data/${title}`, 'utf-8', (err, readData) => {
        if (readData === undefined)
          readData = data;

        const templateHTML = `
          <!doctype html>
          <html>
          <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ul>${fileList}</ul>
            ${btn}            
            <h2>${title}</h2>
            <div>${readData}</div>
          </body>
          </html>
          `;
        
        res.writeHead(200);
        res.end(templateHTML);
      });
    }

    if (pathname === '/') { // home
      if (title === undefined) {
        title = 'Welcome';
        btn = '<a href="/create">create</a>';
        renderHTML('Hello, Node.js!');

      } else { // /?id=''
        btn = `<a href="/create">create</a>
               <a href="/update/?id=${title}">update</a>`;
      }
      renderHTML();

    } else if (pathname === '/create') { 
      const templateForm = `
        <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p><textarea name="description" placeholder="description"></textarea></p>
          <p><input type="submit"></p>
        </form> 
      `;

      title = 'create';
      renderHTML(templateForm);

    } else if (pathname === '/create_process') {
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const post = qs.parse(body),
              reqTitle = post.title,
              reqDesc = post.description;

        fs.writeFile(`o_data/${reqTitle}`, reqDesc, err => {
          if (err) throw err;
          res.writeHead(302, {Location: `/?id=${reqTitle}`});
          res.end();
        });
      });

    } else if (pathname === '/update') {
      renderHTML();
    } else {
      res.writeHead(404);
      res.end('Not Found');
    } 
  });

app.listen(3000);