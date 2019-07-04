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
    try {
        const { twit, url } = req.body;
        const hashtags = twit.match(/#[^\s]*/ig);

        if (hashtags) {
            hashtags.map(h => {
                let hashtag = h.slice(1).toLowerCase();

                if (hashtag === '') return;

                db.query('SELECT hashtagName FROM hashtag WHERE hashtagName=?', [hashtag], (err, result) => {
                    if (err) console.error(err);
                    if (result[0]) {
                        return;
                    } else {
                        db.query(`INSERT INTO hashtag (hashtagName) VALUES (?)`, [hashtag]);
                    }
                });
            });
        }

        await db.query(`INSERT INTO post (postContent, postImgUrl, postCreatedAt, userId) VALUES (?, ?, Now(), ?)`,
                [twit, url ? url : null, req.user.id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await db.query('DELETE FROM post WHERE postId=? and userId=?', [req.params.id, req.user.id]);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;