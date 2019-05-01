const express = require('express'),
      fs = require('fs'),
      qs = require('querystring'),
      path = require('path'),
      sanitizeHtml = require('sanitize-html'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      app = express();

const template = require('./template2.js'),
      topicRouter = require('./o_routes/topic.js');

// middleware
app.use(express.static('o_public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*', (req, res, next) => {
    fs.readdir('./o_data', (err, filelist) => {
        req.list = filelist;
        next();
    });
});

// routing
// home
app.get('/', (req, res) => {
    const title = 'Welcome',
            description = 'Hello, Node.js',
            list = template.list(req.list),
            html = template.html(title, list,
            `<h2>${title}</h2>${description}
             <p><img src='/o_image/unsplash1.jpg' style='width:50%'></p>`,
            `<a href="/create">create</a>`
    ); 
    res.send(html);
});

// read 
app.get('/topic/:pageId', (req, res, next) => {
    const filteredId = path.parse(req.params.pageId).base;
    
    fs.readFile(`o_data/${filteredId}`, 'utf8', (err, description) => {
        if (err) next(err); // 인자 4개인 미들웨어 (맨 아래) 실행

        const title = req.params.pageId,
                sanitizedTitle = sanitizeHtml(title),
                sanitizedDescription = sanitizeHtml(description, {allowedTags:['h1']});
                
                const list = template.list(req.list),
                html = template.html(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                ` <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
                    <input type="submit" value="delete">
                    </form>`);
        res.send(html);
    });
});

// topic
app.use('topic', topicRouter);

// error handler
app.use((req, res, next) => {
    res.status(404).send(`Sorry we can't find page`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(3000);