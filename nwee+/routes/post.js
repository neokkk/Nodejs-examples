const express = require('express'),
      multer = require('multer');

const router = express.Router();

const db = require('../models');
const { isLoggedIn, upload } = require('./middlewares');

// 이미지가 있는 post 작성
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    res.json({ uploadFile: `/uploads/${req.file.filename}` });
});

const upload2 = multer();

// 새로운 post 작성
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        const { twit, url } = req.body;
        const hashtags = twit.match(/#[^\s]*/ig);

        const insertPost = await db.query(`INSERT INTO post (postContent, postImgUrl, postCreatedAt, userId) VALUES (?, ?, Now(), ?)`, [twit, url ? url : null, req.user.id]);

        if (hashtags) {
            hashtags.map(async h => {
                let hashtag = h.slice(1).toLowerCase();

                if (hashtag === '') return;

                const selectHashtag = await db.query('SELECT * FROM hashtag WHERE hashtagName=?', [hashtag]);

                if (selectHashtag[0]) {
                    await db.query(`UPDATE hashtag SET hashtagCount=${selectHashtag[0].hashtagCount}+1 WHERE hashtagId=${selectHashtag[0].hashtagId}`)
                    await db.query(`INSERT INTO posthashtag (postId, hashtagId) VALUES (?, ?)`, [insertPost.insertId, selectHashtag[0].hashtagId]);
                } else {
                    const insertHashtag = await db.query(`INSERT INTO hashtag (hashtagName, hashtagCount) VALUES (?, ${1})`, [hashtag]);
                    await db.query(`INSERT INTO posthashtag (postId, hashtagId) VALUES (?, ?)`, [insertPost.insertId, insertHashtag.insertId]);
                }
            });
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// post 삭제
router.delete('/:id', async (req, res, next) => {
    try {
        await db.query('DELETE FROM post WHERE postId=? AND userId=?', [parseInt(req.params.id), req.user.id]);
        const selectHashtag = await db.query('SELECT hashtagId FROM posthashtag WHERE postId=?', [parseInt(req.params.id)]);
        console.log('selectHashtag');
        console.log(selectHashtag);

        selectHashtag.forEach(async v => {
            await db.query(`UPDATE hashtag SET hashtagCount=${hashtagCount}-1 WHERE hashtagId=?`, [v.hashtagId]);
        });

        await db.query('DELETE FROM posthashtag WHERE postId=?', [parseInt(req.params.id)]);

        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// hashtag 검색
router.get('/hashtag', async (req, res, next) => {
    try {
        const hashtag = req.query.hashtag;
        console.log(hashtag);
        const hashtagId = await db.query(`SELECT hashtagId FROM hashtag WHERE hashtagName='${hashtag}'`);
        console.log(hashtagId);

        const hashtagTwits = await db.query(`SELECT p.postId, p.postContent, p.postImgUrl, p.postCreatedAt, p.userId
            FROM post AS p JOIN posthashtag AS ph ON ph.postId=p.postId AND ph.hashtagId=${hashtagId[0].hashtagId}
            ORDER BY p.postCreatedAt DESC`);
        
        res.render('main', { user: req.user, twits: hashtagTwits });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;