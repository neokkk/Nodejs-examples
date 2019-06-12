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

router.post('/', (req, res, next) => {
    console.log(req.body);
});

module.exports = router;