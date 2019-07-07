const express = require('express'),
      df = require('dateformat');

const router = express.Router();

const { isNotLoggedIn } = require('./middlewares');
const db = require('../models');

// get index page
router.get('/', async (req, res, next) => {
  try {
    await db.query(`SELECT p.postId, p.postContent, p.postImgUrl, p.postCreatedAt, p.userId, u.nickname, u.imgUrl
      FROM post AS p JOIN user AS u ON p.userId = u.id ORDER BY p.postCreatedAt DESC LIMIT 9`, async (err, result) => {
        if (err) console.error(err);
        
        let page = 0;
        res.render('main', { user: req.user, twits: result, page });
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/scroll/:no', async (req, res, next) => {
  const page = req.params.no;
  
  await db.query(`SELECT p.postId, p.postContent, p.postImgUrl, p.postCreatedAt, p.userId, u.nickname, u.imgUrl
      FROM post AS p JOIN user AS u ON p.userId = u.id ORDER BY p.postCreatedAt DESC LIMIT ${page}, 10`, (err, result) => {
        res.render('main', { result });
  });
});

// get join page
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join');
});

module.exports = router;
