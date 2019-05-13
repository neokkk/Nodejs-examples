const express = require('express');
      router = express.Router();

const Post = require('../schemas/post');

/* GET home page. */
router.get('/', (req, res, next) => {
    Post.find({})
        .then(data => {
            res.render('post/list', { data });
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
});

router.get('/new', (req, res, next) => {
    res.render('post/form');
});

// Read Detail
router.get('/:id', (req, res, next) => {
    console.log(req.param);
    Post.findOne({ _id: req.param.id })
        .then(data => {
            res.render('post/detail', { data });
        })
        .catch(err => {
            next(err);
        });
})

// create
router.post('/', (req, res, next) => {
    const formData = req.body;

    const post = new Post({
        title: formData.form_title, 
        contents: formData.form_text
    });

    post.save()
        .then((data) => {
            console.log(data);
            res.redirect('/');
        })
        .catch(err => {
            next(err);
        });
});

// update
router.patch('/:id', (req, res, next) => {

})

// delete
router.delete('/:id', (req, res, next) => {

})

module.exports = router;
