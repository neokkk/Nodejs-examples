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
        if (req.user) {
          await db.query(`SELECT followingId FROM follow WHERE followerId=${req.user.id}`, (err2, result2) => {
            if (err2) console.error(err2);

            const follow = result2.map(v => v.followingId);
            console.log(follow);

            res.render('main', { user: req.user, twits: result, follow });
          });
        } else {
          res.render('main', { user: req.user, twits: result });
        }
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
        console.log(result);
        res.send({ 'result': result });
  });
});

// get join page
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join');
});

module.exports = router;
