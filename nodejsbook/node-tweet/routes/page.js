const express = require('express'),
      router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

// 메인 페이지
router.get('/', (req, res, next) => {
    Post.findAll({
        include: [{
            model: User,
            attributes: ['id', 'nick']
        }, {
            model: User,
            attributes: ['id', 'nick'],
            as: 'Liker',
        }]
    })
        .then(posts => {
            res.render('main', {
                title: 'Nweet',
                twits: posts,
                user: req.user, // passport가 세션에 저장해놓은 정보
                loginError: req.flash('loginError')
            });
        })
        .catch(err =>{
            console.error(err);
            next(err);
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