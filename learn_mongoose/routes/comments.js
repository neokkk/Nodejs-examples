const express = require("express");
const router = express.Router();
const Comment = require('../schemas/comment');

/* Read Comments */
router.get("/:id", (req, res, next) => {
    Comment.find({ commenter: req.params.id }).populate('commenter') // sequelize의 include와 비슷한 속성
        .then(comments => {
            res.json(comments);
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
});

/* Update */
router.patch("/:id", (req, res, next) => {
    Comment.update({ _id: req.params.id }, { comment: req.body.comment })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
});

/* Create */
router.post("/", (req, res, next) => {
    const post = new Comment({
        commenter: req.body.id,
        comment: req.body.comment
    });

    post.save()
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
});

/* Delete */
router.delete("/:id", (req, res, next) => {
    Comment.remove({ _id: req.params.id })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            console.error(err);
            next(err);
        })
});

module.exports = router;