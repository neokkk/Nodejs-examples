const express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { nick, email, pwd, pwdck, comment } = req.body;

    try {
        const hash = await bcrypt.hash(pwd, 12);

        await db.query(`SELECT * FROM user WHERE email=${email}`, (err, result) => {
            if (err) throw err;
            if (result) console.error('이미 존재하는 사용자입니다.');
            res.redirect('/join');
        });

        await db.query(`INSERT INTO user (nickname, email, password, comment, joindDate) VALUES (?, ?, ?, ?, Now())`,
            [`${nick}`, `${email}`, `${hash}`, `${comment}`], (err, result) => {
                if (err) throw err;
                console.log(result);
                res.render('main');
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            next(authError);
        }

        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }

        return req.login((user, loginError) => {
            if (loginError) {
                console.error(loginError);
                next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, rex) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;