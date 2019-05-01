const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      qs = require('querystring'),
      mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});

db.connect();

const app = http.createServer((req, res) => {
    const _url = req.url,
          queryData = url.parse(_url, true).query,
          pathname = url.parse(_url, true).pathname;

    let title = queryData.id,
        fileList = '',
        btn = '';

    const template = {
        list : () => {
            db.query('SELECT * FROM t_o_data', (err, data) => {
                if (err) throw err;
                for (let i = 0; i < data.length; i++) {
                    fileList += `<li><a href='/?id=${data[i].id}'>${data[i].title}</a></li>`;
                }
                return fileList;
            });
        },

        html : (h_title, h_desc, h_btn) => {
            return `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${h_title}</title>
                <meta charset='utf-8'>
                </head>
                <body>
                <h1><a href='/'>WEB</a></h1>
                <ul>${fileList}</ul>
                ${h_btn}            
                <h2>${h_title}</h2>
                <div>${h_desc}</div>
                </body>
                </html>
            `
        },

        form : (h_id, h_act) => {
            return `
                <form action='/${h_act}_process' method='post'>
                       <input type='hidden' name='new_id' value='${h_id}'>
                    <p><input type='text' name='new_title' placeholder='title'></p>
                    <p><textarea name='new_description' placeholder='description'></textarea></p>
                    <p><input type='submit'></p>
                </form>
            `
        }
    }

    if (pathname === '/') {
        if (queryData.id === undefined) { // home
            title = 'Welcome';
            desc = 'Hello, Node.js';
            btn = `<a href='/create'>create</a>`;

            template.list();

            res.writeHead(200);
            res.end(template.html(title, desc, btn));
        } else {
            db.query('SELECT * FROM t_o_data', (err, data) => {
                if (err) throw err;

                title = data.title;
                desc = data.description;
                btn = `<a href='/update'>update</a><a href='/delete'>delete</a>`;

                template.list();
                
                res.writeHead(200);
                res.end(template.html(title, desc, btn));
            });
        }
    } else if (pathname === '/create') {
        db.query('SELECT * FROM t_o_data', (err, data) => {
            if (err) throw err;

            title = 'create';
            desc = template.form(data.length + 1, 'create');
            btn = '';

            template.list();

            res.writeHead(200);
            res.end(template.html(title, desc, btn));
        });
    } else if (pathname === '/create_process') {
        let body = '';

        req.on('data', data => {
            body += data;
        });

        req.on('end', () => {
            const post = qs.parse(body),
                  reqId = post.new_id,
                  reqTitle = post.new_title,
                  reqDesc = post.new_description;

            db.query(`
                INSERT INTO t_o_data (title, description, created, author_id) 
                VALUES (?, ?, Now(), ?)`, 
                [reqTitle, reqDesc, 1], 
                (err, data) => {
                    if (err) throw err;

                    res.writeHead(302, { Location: `/?id=${data.insertId}`});
                    res.end();
            });
        });
    }

}).listen(3000);