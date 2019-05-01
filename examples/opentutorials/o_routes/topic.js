const express = require('express'),
      router = express.Router(),
      path = require('path'),
      fs = require('fs'),
      sanitizeHtml = require('sanitize-html'),
      template = require('../template2.js');



// create
router.get('/create', (req, res) => {
    const title = 'WEB - create',
            list = template.list(req.list),
            html = template.html(title, list, `
            <form action="/topic/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                <input type="submit">
                </p>
            </form>`, '');
    res.send(html);
});

router.post('/create_process', (req, res) => {
    const post = req.body,
          reqTitle = post.title,
          reqDesc = post.description;

    fs.writeFile(`o_data/${reqTitle}`, reqDesc, err => {
        res.writeHead(302, { Location: `/page/${reqTitle}` });
        res.end();
    });
});

// update
router.get('/update/:pageId', (req, res) => {
    const filteredId = path.parse(req.params.pageId).base;

    fs.readFile(`o_data/${filteredId}`, 'utf8', (err2, description) => {
        const title = req.params.pageId,
                list = template.list(req.list),
                html = template.html(title, list, `
                <form action="/topic/update_process" method="post">
                    <input type="hidden" name="old_title" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`,
                `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`);
        res.send(html);
    });
});

router.post('/update_process', (req, res) => {
    const post = req.body,
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

// delete
router.post('/delete_process', (req, res) => {
    const post = req.body,
          reqId = post.id,
          filteredId = path.parse(reqId).base;

    fs.unlink(`o_data/${filteredId}`, err => {
        res.redirect('/');
    });
});

module.exports = router;