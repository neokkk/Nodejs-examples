const express = require('express'),
      axios = require('axios');

const router = express.Router();

// token request function
const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post('http://localhost:8002/v2/token', {
        clentSecret: process.env.CLIENT_SECRET,
      });

      req.session.jwt = tokenResult.data.token;
    }

    return await axios.get(`http://localhost:8002/v2/${api}`, {
      headers: { authorization: req.session.jwt }
    });
  } catch (err) {
    console.error(err);
  }
}

router.get('/test', async (req, res, next) => {
  try {
    if (!req.session.jwt) { // 세션에 토큰이 없으면
      const tokenResult = await axios.post('http://localhost:8002/v2/token', {
        clientSecret: process.env.CLIENT_SECRET,
      });

      if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공
        req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
      } else { // 토큰 발급 실패
        res.json(tokenResult.data); // 발급 실패 사유 응답
      }
    }
    // 발급받은 토큰 테스트
    const result = await axios.get('http://localhost:8002/v2/test', {
      headers: { authorization: req.session.jwt },
    });

    res.json(result.data);
  } catch (error) {
    console.error(error);

    if (error.response.status === 419) { // 토큰 만료 시
      res.json(error.response.data);
    }

    next(error);
  }
});

// /mypost => nweet-api /post/my (token)
router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/post/my');

    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// /search/:hashtag => nweet-api /post/hashtag/:hashtag (token)
router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(req, `/post/hashtag/${encodeURIComponent(req.params.hashtag)}`); // 한글 에러 처리

    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/follow', async (req, res, next) => {
  try {
    const result = await request(req, '/follow');

    res.json(result.data);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});

module.exports = router;