const express = require('express');

const router = express.Router();

const { isNotLoggedIn } = require('./middlewares');
const db = require('../models');

// 메인 페이지
router.get('/', async (req, res, next) => {
  try {
    const twits = await db.query(`SELECT p.postId, p.postContent, p.postImgUrl, p.postCreatedAt, p.userId, u.nickname, u.imgUrl
      FROM post AS p JOIN user AS u ON p.userId=u.id ORDER BY p.postCreatedAt DESC LIMIT 20`);

    const trends = await db.query(`SELECT hashtagId, hashtagName FROM hashtag ORDER BY hashtagCount DESC LIMIT 5`);
      
    if (req.user) { // 로그인된 user가 있으면
      const myTwits = await db.query(`SELECT COUNT(*) AS myTwits FROM post WHERE userId=${req.user.id}`); // 내 트윗 수 출력
      const followers = await db.query(`SELECT COUNT(*) AS followers FROM follow WHERE followingId=${req.user.id}`); // 팔로워 수 출력

      const follow = await db.query(`SELECT followingId FROM follow WHERE followerId=${req.user.id}`); 
      const followingId = follow.map(v => v.followingId); // 팔로잉 중인 id 저장

      res.render('main', { user: req.user, twits, myTwits: myTwits[0].myTwits, followers: followers[0].followers, follow: followingId, trends });
    } else {
      res.render('main', { user: req.user, twits, trends });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 무한 스크롤링
router.get('/scroll/:no', async (req, res, next) => {
  const page = Number(req.params.no);
  const newTwits = await db.query(`SELECT p.postId, p.postContent, p.postImgUrl, p.postCreatedAt, p.userId, u.nickname, u.imgUrl
      FROM post AS p JOIN user AS u ON p.userId = u.id ORDER BY p.postCreatedAt DESC LIMIT ${page+9}`);

  res.render('main', { twits: newTwits, page });
});

// 회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join');
});

module.exports = router;
