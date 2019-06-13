const express = require('express'),
      path = require('path'),
      multer = require('multer');

const router = express.Router();

const db = require('../models');
const { isLoggedIn } = require('./middlewares');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        await db.query(`INSERT INTO post (postContent, postCreatedAt, userId) VALUES (?, Now(), ?)`,
            [`${req.body.twit}`, `${req.user.id}`], err => { if (err) throw err; }
        );
        await db.query(`SELECT * FROM post`, (err, result) => {
            if (err) throw err;
            res.render('main', { twits: result });
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/img', (req, res, next) => {
    axios.post('/post', { data: req.body });
});

module.exports = router;