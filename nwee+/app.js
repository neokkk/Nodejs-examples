const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan'),
      helmet = require('helmet'),
      passport = require('passport'),
      flash = require('connect-flash'),
      session = require('express-session');
      
require('dotenv').config();

const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/user'),
      postRouter = require('./routes/post');
      authRouter = require('./routes/auth');

const passportConfig = require('./passport');

const app = express();

passportConfig(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/post', postRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
