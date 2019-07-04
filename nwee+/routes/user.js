const express = require('express'),
      bcrypt = require('bcrypt'),
      router = express.Router();

const { isLoggedIn, upload } = require('./middlewares');
const db = require('../models');

/* GET users listing. */
router.get('/', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/edit', isLoggedIn, async (req, res, next) => {
  try {
    const { nick, pwd, comment, profileImg } = req.body;

    if (pwd === '') {
      await db.query('UPDATE user SET nickname=?, imgUrl=?, comment=?, updateDate=Now() WHERE email=?',
          [nick, profileImg, comment, req.user.email]);
      res.redirect('/');
    } else {
      const hash = await bcrypt.hash(pwd, 12);
  
      await db.query('UPDATE user SET nickname=?, password=?, imgUrl=?, comment=?, updateDate=Now() WHERE email=?',
          [nick, hash, profileImg, comment, req.user.email]);
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/edit/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ uploadFile: `/uploads/${req.file.filename}` });
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    db.query('INSERT INTO follow (followerId, followingId) VALUES (?, ?)', 
      [req.user.id, parseInt(req.params.id)]);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    db.query('DELETE FROM follow WHERE followerId=? AND followingId=?',
        [req.user.id, parseInt(req.params.id)]);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
