const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const db = require('../models');

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // done(err, success, fail)
    });

    passport.deserializeUser((id, done) => {
        db.query(`SELECT * FROM user WHERE id=${id}`, (err, result) => {
            if (err) throw err;
            done(null, result);
        });
    });

    local(passport);
    kakao(passport);
}