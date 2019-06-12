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
                if (err) throw err;
                if (result.length > 0) {
                    // 비밀번호 검사
                    bcrypt
                        .compare(password, result[0].password)
                        .then(resolve => {
                            console.log(resolve);
                            if (resolve) done(null, result[0]);
                            else done(null, false);
                        })
                        .catch(err => console.error(err));
                } else {
                    done(null, false);
                }
            });
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}