const express = require("express");
const router = express.Router();
const User = require('../schemas/user');

/* GET home page. */
router.get("/", function(req, res, next) {
  User.find() // sequelize => findAll()
    .then(users => {
      res.render("mongoose", { users });
    })
    .catch(err => {
      console.error(err);
      next(err);
    })
});

module.exports = router;
