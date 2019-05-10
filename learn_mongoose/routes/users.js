const express = require("express");
const router = express.Router();
const User = require('../schemas/user');

/* Read Users */
router.get("/", (req, res, next) => {
    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
});

router.post("/", (req, res, next) => {
    const user = new User({ // create
        name: req.body.name,
        age: req.body.age,
        married: req.body.married
    });
    user.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
});

module.exports = router;
