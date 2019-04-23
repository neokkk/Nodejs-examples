const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      qs = require('querystring'),
      mysql = require('mysql');

const db = mysql.createConnection({
  
});

let dbId = [],
    dbTitle = [],
    dbDesc = [];

db.connect();
db.query('SELECT * FROM t_o_data', (err, data) => {
  if (err) throw err;

  for (let i = 0; i < data.length; i++) {
    dbId.push(data[i].id);
    dbTitle.push(data[i].title);
    dbDesc.push(data[i].description);
  }
});

console.log(dbId, dbTitle, dbDesc);

const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query,
          pathname = url.parse(_url, true).pathname;

    const templateForm = (f_title, f_desc, f_act) => {
      return `
        <form action="http://localhost:3000/${f_act}_process" method="post">
          <p><input type="text" name="title" placeholder="title" value="${f_title}"></p>
          <p><textarea name="description" placeholder="description">${f_desc}</textarea></p>
          <p><input type="submit"></p>
        </form> 
      `;
    } 

    let title = queryData.id,
        desc = '',
        fileList = '',
        btn = '';

    const template = {

      // 리스트 보여주기
      list : function() {
          for (let i = 0; i < dbTitle.length; i++) {
            fileList += `<li><a href='/?id=${dbTitle[i]}'>${dbTitle[i]}</a></li>`;
          }
      },
  
      // 파일 읽은 후 HTML 렌더링
      html : function(data) {
          if (typeof data === String)
            readData = data;
          else 
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
        }
      }
  
    if (pathname === '/') { // home
      if (title === undefined) {
        title = 'Welcome';
        btn = '<a href="/create">create</a>';

        template.list();
        template.html('Hello, Node.js!');

      } else { // /?id=''
        btn = `<a href="/create">create</a>
               <a href="/update?id=${title}">update</a>
               <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
               </form>`;

        template.list();
        template.html();
      }

    } else if (pathname === '/create') { 
      title = 'create';

      template.list();
      template.html(templateForm('', '', 'create'));

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
      template.list();
      template.html(templateForm(title, desc, 'update'));

    } else if (pathname === '/update_process') {
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const post = qs.parse(body),
              id = post.id,
              reqTitle = post.title,
              reqDesc = post.description;

        fs.rename(`o_data/${id}`, `o_data/${title}`, err => {
          fs.writeFile(`o_data/${reqTitle}`, reqDesc, err => {
            if (err) throw err;
  
            res.writeHead(302, {Location: `/?id=${reqTitle}`});
            res.end();
          });
        });

      });

    } else if (pathname ==='/delete_process') {
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const post = qs.parse(body),
              id = post.id;

        fs.unlink(`o_data/${id}`, err => {
          if (err) throw err;

          res.writeHead(302, {Location: '/'});
          res.end();
        });
      });

    } else {
      res.writeHead(404);
      res.end('Not Found');
    } 
  });

app.listen(3000);