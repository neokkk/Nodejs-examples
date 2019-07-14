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
        const postHashtag = {};

        await db.query(`INSERT INTO post (postContent, postImgUrl, postCreatedAt, userId) VALUES (?, ?, Now(), ?)`,
                [twit.replace(/(?:\r\n|\r|\n)/g, '<br/>'), url ? url : null, req.user.id]);

        await db.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
            console.log(result);
            postHashtag.postIndex = result;
        });

        console.log('posthashtag');
        console.log(postHashtag);
        
        if (hashtags) {
            hashtags.map(async h => {
                let hashtag = h.slice(1).toLowerCase();

                if (hashtag === '') return;

                await db.query('SELECT * FROM hashtag WHERE hashtagName=?', [hashtag], async (err, result) => {
                    console.log(result);
                    if (err) console.error(err);
                    if (result[0]) {
                        postHashtag.hashtagIndex = result.hashtagId;
                        await db.query(`UPDATE hashtag SET hashtagCount=${result[0].hashtagCount}+1 WHERE hashtagId=${result[0].hashtagId}`)
                    } else {
                        await db.query(`INSERT INTO hashtag (hashtagName) VALUES (?)`, [hashtag]);
                        await db.query(`SELECT LAST_INSERT_ID()`, (err2, result2) => {
                            postHashtag.hashtagIndex = result2;
                        });
                    }

                    //await db.query(`INSERT INTO posthashtag (postId, hashtagId) VALUES (?, ?)`, [postHashtag.postIndex, postHashtag.hashtagIndex], err => console.log(err));
                });
            });
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await db.query('DELETE FROM post WHERE postId=? AND userId=?', [req.params.id, req.user.id]);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;