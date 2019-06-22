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
            await db.query(`SELECT * FROM user WHERE email='${email}'`, async (err, result) => {
                console.log(result);
                if (err) throw err;
                if (result.length > 0) {
                    // 비밀번호 검사
                    await bcrypt
                        .compare(password, result[0].password)
                        .then(resolve => {
                            console.log(resolve);
                            if (resolve) done(null, result[0]);
                            else {
                                done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                                alert('비밀번호가 일치하지 않습니다.');
                            }
                        })
                        .catch(err => console.error(err));
                } else {
                    done(null, false, { message: '가입되지 않은 회원입니다.' });
                    alert('가입되지 않은 회원입니다.');
                }
            });
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}