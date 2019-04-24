const express = require('express'),
      router = express.Router(),
      firebase = require('firebase'),
      dateFormat = require('dateformat');

// home
router.get('/', (req, res, next) => {
    res.redirect('board2/boardList');
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
            res.render('board2/boardList', {rows: rows});
        })
        .catch(err => console.log('Error getting documents', err));
});

// 게시물 읽기
router.get('/boardRead', (req, res, next) => {
    db.collection('board').doc(req.query.brdno).get()
        .then(doc => {
            const childData = doc.data();

            childData.brddate = dateFormat(childData.brddate, 'yyyy-mm-dd');
            res.render('board2/boardRead', {row: childData});
        })
});

// 게시물 작성
router.get('/boardForm', (req, res, next) => {
    // new
    if (!req.query.brdno) {
        res.render('board2/boardForm', {row: ""});
        return;
    }

    // update
    db.collection('board').doc(req.query.brdno).get()
        .then(doc => {
            const childData = doc.data();
            res.render('board2/boardForm', {row: childData});
        })
});

// 게시물 저장
router.post('/boardSave', (req, res, next) => {
    const postData = req.body;

    if (!postData.brdno) { // new
        const doc = db.collection('board').doc();

        postData.brddate = Date.now();
        postData.brdno = doc.id;
        doc.set(postData);
    } else { // update
        const doc = db.collection('board').doc(postData.brdno);
        doc.update(postData);
    }
    res.redirect('boardList');
});

// 게시물 삭제
router.get('/boardDelete', (req, res, next) => {
    db.collection('board').doc(req.query.brdno).delete();
    res.redirect('boardList');
});

module.exports = router;