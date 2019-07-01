const express = require('express'),
      flash = require('connect-flash');
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

// get index page
router.get('/', async (req, res, next) => {
  try {
    await db.query(`SELECT p.postId, p.postContent, p.postImgUrl, p.postCreatedAt, p.userId, u.nickname, u.imgUrl
      FROM post AS p JOIN user AS u ON p.userId = u.id ORDER BY p.postCreatedAt DESC`, async (err, result) => {
        if (err) console.error(err)
        console.log(req.user);
        res.render('main', { user: req.user, twits: result});
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// get join page
router.get('/join', (req, res, next) => {
  res.render('join');
});

module.exports = router;
