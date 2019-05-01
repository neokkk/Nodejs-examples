const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      qs = require('querystring'),
      path = require('path'),
      sanitizeHtml = require('sanitize-html'),
      mysql = require('mysql'),
      template = require('./template.js');

const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'test'
});
db.connect();
 
 
const app = http.createServer((req, res) => {
    const _url = req.url,
          queryData = url.parse(_url, true).query,
          pathname = url.parse(_url, true).pathname;

    if (pathname === '/') { // home
        if (queryData.id === undefined) {
            db.query(`SELECT * FROM t_o_data`, (err, topics) => {
            const title = 'Welcome',
                    description = 'Hello, Node.js',
                    list = template.list(topics);
                    html = template.html(title, list,`<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);

            res.writeHead(200);
            res.end(html);
            });
        } else {
            db.query(`SELECT * FROM t_o_data`, (err, topics) => {
                if (err) throw err;

                db.query(`SELECT * FROM t_o_data LEFT JOIN t_o_author ON t_o_data.author_id=t_o_author.id WHERE t_o_data.id=?`,[queryData.id], (err2, topics2) => {
                    if (err2) throw err2;

                    const title = topics2[0].title,
                        description = topics2[0].description,
                        list = template.list(topics),
                        html = template.html(title, list,
                            `
                            <h2>${title}</h2>
                            ${description}
                            <p>by ${topics2[0].name}</p>
                            `,` 
                            <a href="/create">create</a>
                            <a href="/update?id=${queryData.id}">update</a>
                            <form action="delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="delete">
                            </form>
                            `
                        );
                    res.writeHead(200);
                    res.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        db.query(`SELECT * FROM t_o_data`, (err, topics) => {
            db.query('SELECT * FROM t_o_author', (err2, authors) => {
                const title = 'Create',
                    list = template.list(topics),
                    html = template.html(title, list,
                        `
                        <form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p>
                            <textarea name="description" placeholder="description"></textarea>
                        </p>
                        <p>
                            ${template.authorSelect(authors)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                        </form>
                        `,
                        `<a href="/create">create</a>`
                    );
                res.writeHead(200);
                res.end(html);
            });
        });
    } else if (pathname === '/create_process') {
        let body = '';

        req.on('data', data => {
            body += data;
        });

        req.on('end', () => {
            const post = qs.parse(body);
            
            db.query(`
                INSERT INTO t_o_data (title, description, created, author_id) 
                VALUES(?, ?, NOW(), ?)`,
                [post.title, post.description, post.author], 
                (err, result) => {
                    if (err) throw err;
                    res.writeHead(302, { Location: `/?id=${result.insertId}` });
                    res.end();
                }
            )
        });
    } else if (pathname === '/update') {
        db.query('SELECT * FROM t_o_data', (err, topics) => {
            if (err) throw err;

            db.query(`SELECT * FROM t_o_data WHERE id=?`, [queryData.id], (err2, topics2) => {
            if (err2) throw err2;

            db.query('SELECT * FROM t_o_author', (err2, authors) => {
                const list = template.list(topics),
                      html = template.html(topics2[0].title, list,
                        `
                        <form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${topics2[0].id}">
                            <p><input type="text" name="title" placeholder="title" value="${topics2[0].title}"></p>
                            <p>
                            <textarea name="description" placeholder="description">${topics2[0].description}</textarea>
                            </p>
                            <p>
                            ${template.authorSelect(authors, topics2[0].author_id)}
                            </p>
                            <p>
                            <input type="submit">
                            </p>
                        </form>
                        `,
                        `<a href="/create">create</a> <a href="/update?id=${topics2[0].id}">update</a>`
                        );
                res.writeHead(200);
                res.end(html);
            });
            });
        });
    } else if (pathname === '/update_process') {
        let body = '';

        req.on('data', data => {
            body += data;
        });

        req.on('end', () => {
            const post = qs.parse(body);
            
            db.query('UPDATE t_o_data SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], (err, result) => {
                res.writeHead(302, { Location: `/?id=${post.id}` });
                res.end();
            });
        });
    } else if (pathname === '/delete_process') {
        let body = '';

        req.on('data', data => {
            body += data;
        });

        req.on('end', () => {
            const post = qs.parse(body);

            db.query('DELETE FROM t_o_data WHERE id = ?', [post.id], (err, result) => {
                if (err) throw err;

                res.writeHead(302, { Location: `/` });
                res.end();
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});
app.listen(3000);