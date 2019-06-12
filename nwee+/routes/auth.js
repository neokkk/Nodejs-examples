const express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

// post auth join page
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { nick, email, pwd, comment } = req.body;

    try {
        const hash = await bcrypt.hash(pwd, 12);

        await db.query(`SELECT * FROM user WHERE email='${email}'`, (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                db.query(`INSERT INTO user (nickname, email, password, comment, joinDate) VALUES (?, ?, ?, ?, Now())`,
                    [ `${nick}`, `${email}`, `${hash}`, `${comment}`], (err2, result2) => {
                        if (err2) throw err2;
                        res.redirect('/');
                });
            } else {
                console.error('이미 존재하는 사용자입니다.');
                req.flash('joinError', '이미 존재하는 사용자입니다.');
                res.redirect('/join');
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// post auth login page
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        req.session.save();

        if (authError) {
            console.error(authError);
            next(authError);
        }

        if (!user) {
            req.flash('loginError', '로그인에 실패하였습니다.');
            res.redirect('/');
        }

        return req.login(user, loginError => {
            if (loginError) {
                console.error(loginError);
                next(loginError);
            }
            res.render('main', { user });
        });
    })(req, res, next);
});

// get auth logout page
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// get auth kakao page
router.get('/kakao', passport.authenticate('kakao'));

// get auth kakao callback page
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), 
    (req, res) => {
        res.render('main', { user: req.user })
    }
);


module.exports = router;