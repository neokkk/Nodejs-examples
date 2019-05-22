const express = require('express'),
      router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

// 메인 페이지
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'Nweet',
        twits: [],
        user: req.user, // passport가 세션에 저장해놓은 정보
        loginError: req.flash('loginError')
    });
});

// 회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res, next) => {
    res.render('join', {
        title: '회원가입 - Nweet',
        user: req.user,
        joinError: req.flash('joinError')
    });
});

// 프로필 페이지
router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', { title: '내 정보 - Nweet', user: null });
});

module.exports = router;