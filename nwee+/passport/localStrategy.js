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
            const user = await db.query(`SELECT * FROM user WHERE email=${email}`);

            if (user) {
                // 비밀번호 검사
                const result = await bcrypt.compare(password, user.password);

                if (result) done(null, user);
                else done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            } else {
                done(null, false, { message: '존재하지 않는 이메일입니다.'});
            }
        } catch (err) {
            console.error(Err);
            done(err);
        }
    }));
}