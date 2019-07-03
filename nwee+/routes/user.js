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
  const { nick, pwd, comment } = req.body;

  try {
    const hash = await bcrypt.hash(pwd, 12);

    await db.query(`UPDATE user SET nickname='${nick}', password='${hash}', comment='${comment}', updateDate=Now() WHERE email='${req.user.email}'`, (err, result) => {
      if (err) console.error(err);

      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/edit/img', isLoggedIn, upload.single('pimg'), (req, res) => {
  console.log(req.file);
  res.json({ uploadFileP: `/uploads/${req.file.filename}` });
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    db.query('INSERT INTO follow (followerId, followingId) VALUES (?, ?)', 
      [req.user.id, parseInt(req.params.id)], err => {
        if (err) throw err;

        res.redirect(303, '/');
      });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    db.query(`DELETE FROM follow WHERE followerId=${req.user.id} AND followingId=${parseInt(req.params.id)}`, (err, result) => {
      console.error(err);
      res.redirect(303, '/');
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
