const express = require('express'),
      path = require('path'),
      multer = require('multer');

const router = express.Router();

const { User, Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) { 
            cb(null, 'uploads/'); // callback(err, result)
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // byte 단위
});

// upload 할 img가 있을 경우
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // input의 id
    console.log(req.file); // multer로 upload한 img는 req.file에 저장
    res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
// upload 할 img가 없을 경우
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    console.log(req.body.url);
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({ // db에 있으면 찾고 없으면 생성
                where: { title: tag.slice(1).toLowerCase() } // # 지우기
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await Post.destroy({ where: { id: req.params.id, userId: req.user.id } });
        res.send('OK');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', async (req, res, next) => {
    const query = req.params.hashtag;
    if (!query) {
        res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.find({ where: { title: query } });
        let posts = [];

        if (hashtag) {
            post = await hashtag.getPosts({ include: [{ model: User }] });
        }
        res.render('/main', {
            title: `${query} || nweet`,
            user: req.user,
            twits: posts
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.find({ where: { id: req.params.id } });
        await post.addLiker(req.user.id);
        res.send('OK');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.find({ where: { id: req.params.id } });
        await post.removeLiker(req.user.id);
        res.send('OK');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;