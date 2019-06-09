const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

const db = require('../models');

module.exports = passport => {
    passport.serializeUser((user, done) => { // session에 저장
        done(null, user.id); // done(err, success, fail)
    });

    passport.deserializeUser((id, done) => { // request 마다 어떻게 object를 만든 것인지
        db.query(`SELECT * FROM user WHERE id='${id}'`, (err, result) => {
            if (err) throw err;
            done(null, result);
        });
    });

    local(passport);
    kakao(passport);
}