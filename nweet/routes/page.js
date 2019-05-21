const express = require('express'),
      router = express.Router();

// 메인 페이지
router.get('/', (req, res, next) => {
    res.render('main', {
        title: 'Nweet',
        twits: [],
        user: null,
        loginError: req.flash('loginError')
    });
});

// 회원가입 페이지
router.get('/join', (req, res, next) => {
    res.render('join', {
        title: '회원가입 - Nweet',
        user: null,
        joinError: req.flash('joinError')
    });
});

// 프로필 페이지
router.get('/profile', (req, res, next) => {
    res.render('profile', { title: '내 정보 - Nweet', user: null });
});

module.exports = router;