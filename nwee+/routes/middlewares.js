const multer = require('multer'),
      path = require('path');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.status(403).send('로그인이 필요한 작업입니다.');
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) next();
    else res.redirect('/');
}

exports.upload = multer({
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
});