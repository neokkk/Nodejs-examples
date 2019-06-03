const express = require('express'),
      path = require('path'),
      passport = require('passport'),
      bcrypt = require('bcrypt'),
      multer = require('multer');

const router = express.Router();

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const db = require('../models');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// post auth join page
router.post('/join', isNotLoggedIn, upload.single('pfImg'), async (req, res, next) => {
    const { nick, email, pwd, comment } = req.body;
    console.log(req.body);

    try {
        const hash = await bcrypt.hash(pwd, 12);

        await db.query(`SELECT * FROM user WHERE email=${email}`, (err, result) => {
            if (err) throw err;
            if (result) console.error('이미 존재하는 사용자입니다.');
            res.redirect('/join');
        });

        await db.query(`INSERT INTO user (nickname, email, password, imgUrl, comment, joinDate) VALUES (?, ?, ?, ?, ?, Now())`,
            [ nick, email, hash, req.file.path || '', comment], (err, result) => {
                if (err) throw err;
                console.log(result);
                res.redirect('/');
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// post 
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            next(authError);
        }

        if (!user) {
            req.flash('loginError', info.message);
            res.redirect('/');
        }

        return req.login((user, loginError) => {
            if (loginError) {
                console.error(loginError);
                next(loginError);
            }
            res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, rex) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;