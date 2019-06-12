const KakaoStrategy = require('passport-kakao').Strategy;

const db = require('../models');

module.exports = passport => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // 기존 유저가 있는지 검사
            await db.query(`SELECT * FROM user WHERE kakaoId='${profile.id}' and provider='kakao'`, (err, user) => {
                if (user.length > 0) done(null, user[0]);
                else {
                    db.query(`INSERT INTO user (nickname, email, kakaoId, provider, joinDate) VALUES (?, ?, ?, 'kakao', now())`,
                        [`${profile.displayName}`, `${profile._json && profile._json.kaccount_email}`, profile.id]);
                }
            });
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}