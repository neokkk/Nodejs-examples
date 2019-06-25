const express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      passport = require('passport'),
      morgan = require('morgan'),
      session = require('express-session'),
      flash = require('connect-flash');

require('dotenv').config();

const { sequelize } = require('./models'),
      passportConfig = require('./passport'),
      authRouter = require('./routes/auth'),
      indexRouter = require('./routes/index'),
      v1 = require('./routes/v1'),
      v2 = require('./routes/v2');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8002);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/v1', v1);
app.use('/v2', v2);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};;
    res.status(err.status || 500);
});

app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 실행중입니다.`);
});