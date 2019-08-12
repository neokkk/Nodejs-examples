const express = require('express'),
      jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares'),
      { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(deprecated);

router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;

  try {
    const domain = await Domain.find({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });

    if (!domain) {
      res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }

    const token = jwt.sign({
      id: domain.user.id,
      nick: domain.user.nick,
    }, process.env.JWT_SECRET, {
      expiresIn: '1m', // 1분
      issuer: 'nodebird',
    });

    res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

router.get('/post/my', verifyToken, (req, res) => {
    Post
        .findAll({ where: { userId: req.decoded.id }})
        .then(posts => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                code: 500,
                message: '서버 에러'
            });
        });
});

router.get('/post/hashtag/:title', verifyToken, async (req, res) => {
    try {
        const hashtag = await Hashtag.find({ where: { title: req.params.title }});

        if (!hashtag) {
            res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.'
            });
        }

        const posts = await hashtag.getPosts();

        res.json({
            code: 300,
            payload: posts
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

router.get('/follow', verifyToken, async (req, res) => {
    try {
        const user = await User.find({ where: { id: req.decoded.id }});
        const follower = await user.getFollowers({ attribute: [ 'id', 'nick' ]});
        const following = await user.getFollowings({ attribute: [ 'id', 'nick' ]});

        res.json({
            code: 200,
            follower,
            following
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            code: 500,
            message: '서버 에러'
        });
    }
});

module.exports = router;