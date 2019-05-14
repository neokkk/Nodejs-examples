const express = require('express');
const router = express.Router();

// login
router.get('/login', (req, res, next) => {
  res.render('user/login');
});

// join
router.get('/join', (req, res, next) => {
  res.render('user/join');
});

module.exports = router;
