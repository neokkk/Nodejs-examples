const express = require('express'),
      multer = require('multer');

const router = express.Router();

const db = require('../models');
const { isLoggedIn, upload } = require('./middlewares');

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    res.json({ uploadFile: `/uploads/${req.file.filename}` });
});

const upload2 = multer();

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    console.log(req.body);
    const { twit, url } = req.body;

    try {
        await db.query(`INSERT INTO post (postContent, postImgUrl, postCreatedAt, userId) VALUES (?, ?, Now(), ?)`,
            [twit, url ? url : null, req.user.id], err => { 
                if (err) throw err; 
                res.redirect('/');
            }
        )
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await db.query(`DELETE FROM post WHERE postId=${req.params.id} and userId=${req.user.id}`, err => {
            if (err) console.error(err);
            res.redirect(303, '/');
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;