const express = require("express");
const User = require("../models").User;

const router = express.Router();

router.get("/", (req, res, next) => {
  User.findAll()
    .then(users => {
      res.render("sequelize", { users });
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

module.exports = router;
