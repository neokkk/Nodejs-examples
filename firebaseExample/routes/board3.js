const express = require('express'),
      router = express.Router(),
      firebase = require('firebase'),
      dateFormat = require('dateformat');

// home
router.get('/', (req, res, next) => {
    res.redirect('board3/boardList');
});

// DB info
const config = {
    
}
// firebase.initializeApp(config);

const db = firebase.firestore(); // firebase cloud firestore

// 게시물 목록
router.get('/boardList', (req, res, next) => {
    db.collection('board').orderBy('brddate', 'desc').get()
        .then(snapshot => {
            const rows = [];

            snapshot.forEach(doc => {
                const childData = doc.data();

                childData.brddate = dateFormat(childData.brddate, 'yyyy-mm-dd');
                rows.push(childData);
            });
            res.render('board3/boardList', {rows: rows});
        })
        .catch(err => console.log('Error getting documents', err));
});

// 게시물 읽기
router.get('/boardRead', (req, res, next) => {
    db.collection('board').doc(req.query.brdno).get()
        .then(doc => {
            const childData = doc.data();

            childData.brddate = dateFormat(childData.brddate, 'yyyy-mm-dd hh:mm');
            res.render('board3/boardRead', {row: childData});
        })
});

// 게시물 작성
router.get('/boardForm', (req, res, next) => {
    // new
    if (!req.query.brdno) {
        res.render('board3/boardForm', {row: ""});
        return;
    }    

    // update
    db.collection('board').doc(req.query.brdno).get()
        .then(doc => {
            const childData = doc.data();
            res.render('board3/boardForm', {row: childData});
        })
});

// 게시물 저장
router.get('/boardSave', (req, res, next) => {
    const postData = req.body;

    if (!postData.brdno) { // new
        const doc = db.collection('board').doc();

        postData.brddate = Date.now();
        postData.brdno = doc.id;
        doc.set(postData);
    } else { // update
        const doc = db.collection('board').doc(postData);
        doc.update(postData);
    }
    res.redirect('boardList');
});

// 게시물 삭제
router.get('/boardDelete', (req, res, next) => {
    db.collection('board').doc(req.query.id).delete();
    res.redirect('boardList');
});

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

module.exports = router;