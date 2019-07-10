const LocalStrategy = require('passport-local').Strategy,
      bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = passport => {
    console.log('start localStrategy');
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const exUser = await User.findOne({ where: { email } });

            if (exUser) {
                const result = await bcrypt.compare(password, exUser.password);

                if (result) done(null, exUser);
                else done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            } else {
                done(null, false, { message: '회원 정보가 존재하지 않습니다.' });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}