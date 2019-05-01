const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      qs = require('querystring'),
      mysql = require('mysql');

const db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'root',
  database : 'test'
});
db.connect();

const dbData = [];

db.query('SELECT * FROM t_o_data', (err, data) => {
  if (err) throw err;

  for (let i = 0; i < data.length; i++) {
    dbData.push(data[i]);
  }
});

const app = http.createServer((req, res) => {
    const _url = req.url;
    const queryData = url.parse(_url, true).query,
          pathname = url.parse(_url, true).pathname;

    const templateForm = (f_id, f_title, f_desc, f_act) => {
      return `
        <form action="http://localhost:3000/${f_act}_process" method="post">
          <p><input type="text" name="title" placeholder="title" value="${f_title}"></p>
          <p><textarea name="description" placeholder="description">${f_desc}</textarea></p>
          <p><input type="hidden" name="id" value="${f_id}"></p>
          <p><input type="submit"></p>
        </form> 
      `;
    } 
    
    let title = queryData.id,
        fileList = '',
        btn = '';

    const dbDataObj = dbData[title - 1];
    const template = {

      // 리스트 보여주기
      list : () => {
          for (let i = 0; i < dbData.length; i++) {
            fileList += `<li><a href='/?id=${dbData[i].id}'>${dbData[i].title}</a></li>`;
          }
      },
  
      // 파일 읽은 후 HTML 렌더링
      html : (titleData, DescData) => {
          const templateHTML = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${titleData}</title>
            <meta charset="utf-8">
            </head>
            <body>
              <h1><a href="/">WEB</a></h1>
              <ul>${fileList}</ul>
              ${btn}            
              <h2>${titleData}</h2>
              <div>${DescData}</div>
            </body>
            </html>
            `;
          
          res.writeHead(200);
          res.end(templateHTML);
        }
      }
  
    if (pathname === '/') { // home
      if (title === undefined) {
        btn = '<a href="/create">create</a>';

        template.list();
        template.html('Welcome', 'Hello, Node.js!');

      } else { // /?id=''
        btn = `<a href="/create">create</a>
               <a href="/update?id=${dbDataObj.id}">update</a>
               <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${dbDataObj.title}">
                <input type="submit" value="delete">
               </form>`;

        template.list();
        template.html(dbDataObj.title, dbDataObj.description);
      }

    } else if (pathname === '/create') { 
      template.list();
      template.html('Create', templateForm(dbData.length + 1, '', '', 'create'));

    } else if (pathname === '/create_process') {
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const post = qs.parse(body),
              reqId = post.id,
              reqTitle = post.title,
              reqDesc = post.description;

        console.log(post);

        db.query(`
          INSERT INTO t_o_data (title, description, created, author_id) 
          VALUES [${reqTitle}, ${reqDesc}, Now(), 1]`,
          (err, result) => {
            if (err) throw err;

            res.writeHead(302, {Location : `/?id=${result.insertId}`});
            res.end();
          });
        });

      } else if (pathname === '/update') {
      template.list();
      template.html(dbDataObj.title, templateForm(dbDataObj.id, dbDataObj.title, dbDataObj.description, 'update'));

    } else if (pathname === '/update_process') {
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const post = qs.parse(body),
              reqId = post.id,
              reqTitle = post.title,
              reqDesc = post.description;

        db.query(`
          UPDATE t_o_data SET title=?, description=?, author_id=1 
          WHERE id=?`, [reqTitle, reqDesc, reqId],
          (err) => {
            if (err) throw err;

            db.query(`SELECT title, description FROM t_o_data WHERE id=${reqId}`, (err, result) => {
              if (err) throw err;

              dbDataObj.title = result[0].title;
              dbDataObj.description = result[0].description;
            });

            res.writeHead(302, {Location: `/?id=${reqId}`});
            res.end();
          });
      });

    } else if (pathname ==='/delete_process') {
      let body = '';

      req.on('data', data => {
        body += data;
      });

      req.on('end', () => {
        const post = qs.parse(body),
              reqId = post.id;

        db.query(`DELETE FROM t_o_data WHERE id=?`, [reqId], (err, result) => {
          if (err) throw err;

          res.writeHead(302, {Location : `/`});
          res.end();
        });
      });

    } else {
      res.writeHead(404);
      res.end('Not Found');
    } 
  });

app.listen(3000);