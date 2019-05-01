const express = require('express'),
      fs = require('fs'),
      qs = require('querystring'),
      path = require('path'),
      sanitizeHtml = require('sanitize-html'),
      template = require('./template2.js'),
      app = express();

// home
app.get('/', (req, res) => {
    fs.readdir('./o_data', (err, filelist) => {
        const title = 'Welcome',
              description = 'Hello, Node.js',
              list = template.list(filelist),
              html = template.html(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        ); 
        res.send(html);
    });
});

// read 
app.get('/page/:pageId', (req, res) => {
    fs.readdir('./o_data', (err, filelist) => {
        const filteredId = path.parse(req.params.pageId).base;

        fs.readFile(`o_data/${filteredId}`, 'utf8', (err2, description) => {
            const title = req.params.pageId,
                  sanitizedTitle = sanitizeHtml(title),
                  sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});

            const list = template.list(filelist),
                  html = template.html(sanitizedTitle, list,
                    `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                    ` <a href="/create">create</a>
                    <a href="/update/${sanitizedTitle}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizedTitle}">
                        <input type="submit" value="delete">
                    </form>`
            );
            res.send(html);
        });
    });
});

// create
app.get('/create', (req, res) => {
    fs.readdir('./o_data', (err, filelist) => {
        const title = 'WEB - create',
              list = template.list(filelist),
              html = template.html(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                    <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                </form>
                `, '');
        res.send(html);
      });
});

app.post('/create_process', (req, res) => {
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

            res.writeHead(302, { Locatioin: `/page/${reqTitle}` });
            res.end();
        });
    });
});

// update
app.get('/update/:pageId', (req, res) => {
    fs.readdir('./o_data', (err, filelist) => {
        const filteredId = path.parse(req.params.pageId).base;

        fs.readFile(`o_data/${filteredId}`, 'utf8', (err2, description) => {
            const title = req.params.pageId,
                  list = template.list(filelist),
                  html = template.html(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="old_title" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update/${title}">update</a>`
                );
            res.send(html);
        });
    });
});

app.post('/update_process', (req, res) => {
    let body = '';

    req.on('data', data => {
        body += data;
    });

    req.on('end', () => {
        const post = qs.parse(body),
              reqOldTitle = post.old_title,
              reqTitle = post.title,
              reqDesc = post.description;

        fs.rename(`/o_data/${reqOldTitle}`, `o_data/${reqTitle}`, err => {
            fs.writeFile(`o_data/${reqTitle}`, reqDesc, 'utf-8', (err2) => {
                res.writeHead(302, { Location: `/page/${reqTitle}` });
                res.end();
            });
        });
    });
});

app.post('/delete_process', (req, res) => {
    let body = '';

    req.on('data', data => {
        body += data;
    });

    req.on('end', () => {
        const post = qs.parse(body),
              reqId = post.id,
              filteredId = path.parse(reqId).base;

        fs.unlink(`o_data/${filteredId}`, err => {
            res.redirect('/');
        });
    });
});

app.listen(3000);