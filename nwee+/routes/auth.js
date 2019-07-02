const express = require('express'),
      passport = require('passport'),
      path = require('path'),
      multer = require('multer'),
      bcrypt = require('bcrypt');

const router = express.Router();

const db = require('../models');
const { isNotLoggedIn } = require('./middlewares');

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
    onError: (err, next) => {
        console.error(err);
        next(err);
    }
})

// post auth join page
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { nick, email, pwd, comment, joinImg } = req.body;
    console.log(joinImg);

    try {
        const hash = await bcrypt.hash(pwd, 12);

        await db.query(`SELECT * FROM user WHERE email='${email}'`, (err, result) => {
            if (err) console.error(err);
            if (result.length === 0) {
                db.query(`INSERT INTO user (nickname, email, password, imgUrl, comment, joinDate) VALUES (?, ?, ?, ?, ?, Now())`,
                    [ `${nick}`, `${email}`, `${hash}`, `${joinImg}`, `${comment}`], err2 => {
                        if (err2) console.error(err2);
                        res.redirect('/');
                });
            } else {
                console.error('이미 존재하는 사용자입니다.');
                req.flash('joinError', '이미 존재하는 사용자입니다.');
                res.redirect('/join');
            }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/join/img', upload.single('img'), (req, res, next) => {
    console.log(req.file);
    res.json({ uploadFile: `/uploads/${req.file.filename}`});
});

// post auth login page
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        req.session.save();

        if (authError) {
            console.error(authError);
            next(authError);
        }

        if (!user) {
            req.flash('loginError', '로그인에 실패하였습니다.');
            res.redirect('/');
        }

        return req.login(user, loginError => {
            if (loginError) {
                console.error(loginError);
                next(loginError);
            }
            res.redirect('/');
        });
    })(req, res, next);
});

// get auth logout page
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

// get auth kakao page
router.get('/kakao', passport.authenticate('kakao'));

// get auth kakao callback page
router.get('/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/' }), 
    (req, res) => {
        res.redirect('/');
    }
); 


module.exports = router;