const express = require('express'),
      bcrypt = require('bcrypt'),
      passport = require('passport');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares'),
      { User } = require('../models');

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    try {
        const { email, nick, password, money } = req.body;
        const exUser = await User.findOne({ where: { email } });

        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            res.redirect('/join');
        }

        const hash = await bcrypt.hash(password, 12);

        await User.create({
            email,
            nick,
            password: hash,
            money
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    console.log('login start');
    passport.authenticate('local', (authError, user, info) => {
        console.log('passport local authenticate');
        if (authError) {
            console.error(authError);
            next(authError);
        }

        if (!user) {
            req.flash('loginError', info.message);
            res.redirect('/');
        }

        console.log('before req.login');
        req.login(user, loginError => {
            console.log('after req.login');
            if (loginError) {
                console.error(loginError);
                next(loginError);
            }

            res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;