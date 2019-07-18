const express = require('express'),
      passport = require('passport'),
      bcrypt = require('bcrypt');

const router = express.Router();

const db = require('../models');
const { isNotLoggedIn, upload } = require('./middlewares');

// 회원가입 요청
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { nick, email, pwd, comment, joinImg } = req.body;

    try {
        const hash = await bcrypt.hash(pwd, 12);

        const selectUser = await db.query('SELECT * FROM user WHERE email=?', [email]);

        if (selectUser[0]) {
            await db.query(`INSERT INTO user (nickname, email, password, imgUrl, comment, joinDate) VALUES (?, ?, ?, ?, ?, Now())`,
                [ nick, email, hash, joinImg, comment]);

            res.redirect('/');
        } else {
            console.log('이미 존재하는 사용자입니다.');
            req.flash('joinError', '이미 존재하는 사용자입니다.');
            res.redirect('/join');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원가입 시 프로필 이미지 업로드
router.post('/join/img', upload.single('img'), (req, res) => {
    res.json({ uploadFile: `/uploads/${req.file.filename}`});
});

// 로그인 요청
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
            res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내부의 매들웨어에는 (req, res, next)를 붙인다.
});

// 로그아웃 요청
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// 카카오 로그인 요청
router.get('/kakao', passport.authenticate('kakao'));

// 카카오 로그인 콜백
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), 
    (req, res) => {
        res.redirect('/');
    }
); 

module.exports = router;