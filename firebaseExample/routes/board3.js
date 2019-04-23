const express = require('express'),
      router = express.Router(),
      firebase = require('firebase');

// 로그인 화면
router.get('/loginForm', (req, res, next) => {
    res.render('board3/loginForm');
});

// 로그인 체크
router.post('/loginCheck', (req, res, next) => {
    firebase.auth().signInWithEmailAndPassword(req.body.id, req.body.passwd)
        .then(firebaseUser => res.redirect('boardList'))
        .catch(err => {
            alert('로그인에 실패하였습니다.');
            res.redirect('loginForm');
        });
});

