const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const db = require('../models');

module.exports = passport => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    }, async (email, password, done) => {
        try {
            // 기존 유저가 있는지 검사
            await db.query(`SELECT * FROM user WHERE email='${email}'`, (err, result) => {
                console.log(result);
                if (result) {
                    // 비밀번호 검사
                    const compare = bcrypt.compare(password, result.password);
    
                    if (compare) done(null, result);
                    else done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                } else {
                    done(null, false, { message: '존재하지 않는 이메일입니다.'});
                }
            });
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}