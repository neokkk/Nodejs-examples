const KakaoStrategy = require('passport-kakao').Strategy;

const db = require('../models');

module.exports = passport => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // 기존 유저가 있는지 검사
            const user = await db.query(`SELECT * FROM user WHERE kakaoId='${profile.id}' and provider='kakao'`);
            console.log(user);
            console.log(profile);

            if (user) done(null, user);
            else {
                await db.query(`INSERT INTO user (nickname, email, kakaoId, provider, joinDate) VALUES (?, ?, ?, 'kakao', now())`,
                    [`${profile.displayName}`, `${profile.json && profile.json.kaccount_email}`, `${profile.id}`], (err, result) => {
                        if (err) throw err;
                        console.log(result);
                        done(null, result);
                });
            }
        } catch (err) {
            console.error(err);
            done(err);
        }
    }));
}