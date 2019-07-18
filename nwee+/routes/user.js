const express = require('express'),
      bcrypt = require('bcrypt'),
      router = express.Router();

const { isLoggedIn, upload } = require('./middlewares');
const db = require('../models');

// 프로필 페이지
router.get('/', isLoggedIn, async (req, res) => {
  const follow = await db.query(`SELECT followingId FROM follow WHERE followerId=${req.user.id}`);
  const followingId = follow.map(v => v.followingId);

  res.render('profile', { user: req.user, follow: followingId });
});

// 프로필 변경
router.post('/edit', isLoggedIn, async (req, res, next) => {
  try {
    const { nick, pwd, comment, profileImg } = req.body;

    // 비밀번호 변경 안했으면
    if (pwd === '') { 
      await db.query('UPDATE user SET nickname=?, imgUrl=?, comment=?, updateDate=Now() WHERE email=?',
          [nick, profileImg, comment, req.user.email]);

      res.redirect('/');
    } 

    // 비밀번호 변경 했으면
    const hash = await bcrypt.hash(pwd, 12);

    await db.query('UPDATE user SET nickname=?, password=?, imgUrl=?, comment=?, updateDate=Now() WHERE email=?',
        [nick, hash, profileImg, comment, req.user.email]);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 프로필 이미지 변경
router.post('/edit/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ uploadFile: `/uploads/${req.file.filename}` });
});

// 팔로우
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    await db.query('INSERT INTO follow (followerId, followingId) VALUES (?, ?)', 
      [req.user.id, parseInt(req.params.id)]);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 언팔로우
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    await db.query('DELETE FROM follow WHERE followerId=? AND followingId=?',
        [req.user.id, parseInt(req.params.id)]);

    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
