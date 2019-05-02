const express = require('express'),
      fs = require('fs'),
      qs = require('querystring'),
      path = require('path'),
      sanitizeHtml = require('sanitize-html'),
      bodyParser = require('body-parser'),
      compression = require('compression')
      helmet = require('helmet'),
      app = express();

const template = require('./template2'),
      indexRouter = require('./o_routes/index'),
      topicRouter = require('./o_routes/topic');

// middleware
app.use(helmet());
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
app.use('/', indexRouter);

// topic
app.use('/topic', topicRouter);

// error handler
app.use((req, res, next) => {
    res.status(404).send(`Sorry we can't find page`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(3000);