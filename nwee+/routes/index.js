const express = require('express');
const router = express.Router();

// get index page
router.get('/', (req, res, next) => {
  res.render('main');
});

// get join page
router.get('/join', (req, res, next) => {
  res.render('join');
})

module.exports = router;
