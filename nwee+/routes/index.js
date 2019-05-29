const express = require('express'),
      flash = require('connect-flash');
const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

// get index page
router.get('/', async (req, res, next) => {
  try {
    await db.query(`SELECT * FROM post`, (err, result) => {
      if (err) throw err;
      res.render('main', {
        twits: result,
        user: req.user,
        loginError: req.flash('loginError')
      });
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// get join page
router.get('/join', (req, res, next) => {
  res.render('join');
})

module.exports = router;
