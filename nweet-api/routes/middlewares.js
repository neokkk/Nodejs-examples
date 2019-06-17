const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // 로그인 여부
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        next(); // verified => next()
    } catch (err) { // failed => error
        if (err.name === 'TokenExpiredError') {
            res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        } 
        res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        });
    }
}