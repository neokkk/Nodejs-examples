const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = passport => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const exUser = await User.find({
                where: {
                    snsId: profile.id, // kakao에서 제공
                    provider: 'kakao'
                },
            });
            // 기존에 kakao로 가입한 유저가 없으면 새로 만듬
            if (exUser) done(null, exUser);
            else {
                console.log(profile);
                const newUser = await User.create({
                    email: profile.json && profile.json.kaccount_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao'
                });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}