const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const db = require('../models');

module.exports = passport => {
    passport.serializeUser((user, done) => { // req.login시 session에 저장
        done(null, user.id); // done(err, success, fail)
    });

    passport.deserializeUser((id, done) => { // request 마다 어떻게 user object를 만들 것인지
        db.query(`SELECT * FROM user WHERE id=${id}`, (err, result) => {
            if (err) throw err;
            done(null, result[0]);
        });
    });

    local(passport);
    kakao(passport);
}