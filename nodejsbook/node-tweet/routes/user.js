const express = require('express');
const router = express.Router();

const { User } = require('../models');
const { isLoggedIn } = require('./middlewares');

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: '내 정보 - nweet', user: req.user });
});

router.post('/profile', isLoggedIn, async (req, res, next) => {
    try {
        User.update({ nick: req.body.nick }, { where: { id: req.user.id } });
        res.redirect('/user/profile');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try { 
        const user = await User.find({ where: { id: req.user.id } });
        await user.addFollowing(parseInt(req.params.id, 10));
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.find({ where: { id: req.user.id } });
        await user.removeFollowing(parseInt(req.params.id, 10));
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;