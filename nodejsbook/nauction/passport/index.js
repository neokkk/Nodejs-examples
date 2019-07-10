const local = require('./localStrategy');
const { User } = require('../models');

module.exports = passport => {
    console.log('start passport index');
    passport.serializeUser((user, done) => { // 고유값 user.id session에 저장
        console.log('passport serializeUser');
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => { // 요청 들어올 때 마다 session에 저장된 정보 확인 후 req.user에 저장
        console.log('passport deserializeUser');
        User
            .findOne({ where: { id } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local(passport);
}