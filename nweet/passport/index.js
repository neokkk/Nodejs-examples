const local = require('./localStrategy'),
      kakao = require('./kakaoStrategy');

const { User } = require('../models');

module.exports = passport => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // user의 id만 저장한다
    });

    passport.deserializeUser((id, done) => {
        User.find({ 
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers'
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings'
            }] 
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });
    local(passport);
    kakao(passport);
}