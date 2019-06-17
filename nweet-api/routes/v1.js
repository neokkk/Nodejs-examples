const express = require('express');
const router = express.Router();

const { verifyToken } = require('./middlewares'),
      { Domain, User, Post, Hashtag } = require('../models');

router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;

    try {
        const domain = await Domain.find({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id']
            }
        });

        if (!domain) {
            res.status(401).json({
                code: 401,
                message: '등록되지 않은 토큰입니다. 도메인을 등록하세요.'
            });
        }

        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'nweet'
        });

        res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token
        });
    } catch (err) {
        res.status(500).json({ // API 서버의 응답 형식은 하나(json)로 통일
            code: 500,
            message: '서버 에러'
        });
    }
});

router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

module.exports = router;