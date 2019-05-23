const express = require('express'),
      cookieParser = require('cookie-parser'),
      morgan = require('morgan'),
      path = require('path'),
      session = require('express-session'),
      flash = require('connect-flash'),
      passport = require('passport');

require('dotenv').config();

const indexRouter = require('./routes/page'),
      userRouter = require('./routes/user'),
      authRouter = require('./routes/auth'),
      postRouter = require('./routes/post');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
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
app.use(passport.session()); // express-session보다 하위에 있어야 한다

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 실행중입니다.`);
});