const express = require('express'),
      bcrypt = require('bcrypt'),
      passport = require('passport');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;

    try {
        const exUser = await User.find({ where: { email } });

        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.');
            res.redirect('/join');
        }
        console.time('암호화 시간');
        const hash = await bcrypt.hash(password, 12);
        console.timeEnd('암호화 시간');
        
        await User.create({
            email,
            nick,
            password: hash
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // localStrategy의 done(에러, 성공, 실패) 이 전달됨
        req.session.save();

        if (authError) {
            console.error(authError);
            next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            res.redirect('/');
        }
        return req.login(user, loginError => { // req.user
            if (loginError) {
                console.error(loginError);
                next(loginError);
            }
            res.redirect('/');
        })
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout(); // req.user
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;