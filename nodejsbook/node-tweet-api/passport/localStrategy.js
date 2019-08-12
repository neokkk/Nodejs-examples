const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = passport => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req.body.email
        passwordField: 'password' // req.body.password
    }, async (email, password, done) => { // done(에러, 성공, 실패)
        try {
            const exUser = await User.find({ where: { email }});
            if (exUser) { // email이 있으면
                // 비밀번호 검사
                const result = await bcrypt.compare(password, exUser.password);
                if (result) {
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                    alert('비밀번호가 일치하지 않습니다.');
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
                alert('가입되지 않은 회원입니다.');
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}