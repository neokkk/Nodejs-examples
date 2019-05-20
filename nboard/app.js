const express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      helmet = require('helmet'),
      logger = require('morgan');

const indexRouter = require('./routes/index'),
      userRouter = require('./routes/users'),
      postRouter = require('./routes/posts');

const app = express();

// MongoDB setting
const connect = require('./schemas/index');
connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// router
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/posts', postRouter);

// error handler
app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err: {};

    res.status(err.status || 500);
    res.render('error', { err });
});

module.exports = app;
