const local = require('./localStrategy'),
      kakao = require('./kakaoStrategy');

const { User } = require('../models');

const user = {}; // 캐싱용 변수

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // user의 id만 저장한다
    });

    passport.deserializeUser((id, done) => {
        // caching : 이미 저장해둔 요청이 있다면 저장해둔 요청 실행
        if (user[id]) {
            done(user[id]);
        } else {
            User.find({ where: { id } })
            .then(user => user[id] = user, done(null, user))
            .catch(err => done(err));
        }
    });

    local(passport);
    kakao(passport);
}