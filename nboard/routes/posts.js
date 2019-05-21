const express = require('express'),
      router = express.Router(),
      moment = require('moment');

const Post = require('../schemas/post');

/* GET home page. */
router.get('/', (req, res, next) => {
    Post.find({})
        .sort('createdAt')
        .then(data => {
            res.render('post/list', { data });
        })
        .catch(err => {
            next(err);
        });
});

router.get('/new', (req, res, next) => {
    res.render('post/form');
});

// Read Detail
router.get('/detail/:id', (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(data => {
            res.render('post/detail', { data });
        })
        .catch(err => {
            next(err);
        });
});

// create
router.post('/create', (req, res, next) => {
    const formData = req.body;

    const post = new Post({
        title: formData.form_title.trim(), 
        content: formData.form_text
    });

    post.save()
        .then(data => {
            res.redirect('/posts');
        })
        .catch(err => {
            next(err);
        });
});

// update
router.get('/update/:id', (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(data => {
            res.render('post/form_update', { data });
        })
        .catch(err => {
            next(err);
        });
});

router.post('/update', (req, res, next) => {
    const formData = req.body;

    Post.update({ _id: formData.id }, {
        title: formData.form_title.trim(),
        content: formData.form_text
    })
        .then(() => {
            res.redirect('/posts');
        })
        .catch(err => {
            next(err);
        });
})

// delete
router.get('/delete/:id', (req, res, next) => {
    Post.remove({ _id: req.params.id })
        .then(result => {
            res.redirect('/posts');
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;
