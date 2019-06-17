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

const upload2 = multer();

router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
    try {
        await db.query(`INSERT INTO post (postContent, postImgUrl, postCreatedAt, userId) VALUES (?, ?, Now(), ?)`,
            [`${req.body.twit}`, req.file ? `${req.file}` : null, `${req.user.id}`], err => { 
                if (err) throw err; 
                res.redirect('/');
            }
        )
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/img', isLoggedIn, upload.single('upload'), (req, res) => {
    console.log(req.file);
});

router.delete('/:id', async (req, res, next) => {
    try {
        await db.query(`DELETE * FROM post WHERE id=${req.params.id} and userId='${req.user.id}'`, (err, result) => {
            res.send('ok');
            res.redirect('/');
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;