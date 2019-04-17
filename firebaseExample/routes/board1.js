const express = require('express'),
      router = express.Router(),
      firebase = require("firebase"),
      dateFormat = require('dateformat');
 
router.get('/', (req, res, next) => {
    res.redirect('boardList');
});
 
const config = {
    apiKey: "AIzaSyCFrpORd_UFV9yH3y4nr46nVeJIeInv37k",    
    authDomain: "fir-example-38d12.firebaseapp.com",    
    databaseURL: "https://fir-example-38d12.firebaseio.com",    
    projectId: "fir-example-38d12",    
    storageBucket: "fir-example-38d12.appspot.com",    
    messagingSenderId: "50947644257"  
};
firebase.initializeApp(config);
       
// 게시물 리스트 목록
router.get('/boardList', (req, res, next) => {
    firebase.database().ref('board').orderByKey().once('value', (snapshot) => {
        const rows = [];
        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();
         
            childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
            rows.push(childData);
        });
        res.render('board1/boardList', {rows: rows});
    });
});
 
// 게시물 읽기
router.get('/boardRead', (req, res, next) => {
    firebase.database().ref('board/' + req.query.brdno).once('value', (snapshot) => {
        const childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        childData.brddate = dateFormat(childData.brddate, "yyyy-mm-dd");
        res.render('board1/boardRead', {row: childData});
    });
});
 
router.get('/boardForm', (req,res,next) => {
    if (!req.query.brdno) {
        res.render('board1/boardForm', {row: ""});
        return;
    }
 
    firebase.database().ref('board/' + req.query.brdno).once('value', (snapshot) => {
        const childData = snapshot.val();
         
        childData.brdno = snapshot.key;
        res.render('board1/boardForm', {row: childData});
    });
});
 
router.post('/boardSave', (req,res,next) => {
    const postData = req.body;

    if (!postData.brdno) {
        postData.brdno = firebase.database().ref().child('posts').push().key;
        postData.brddate = Date.now();
    } else {
        postData.brddate = Number(postData.brddate);
    }
    firebase.database().ref('board/' + req.body.brdno).set(req.body);

    //var updates = {};
    //updates['/board/' + postData.brdno] = postData;
    //firebase.database().ref().update(updates);
     
    res.redirect('boardList');
});
 
router.get('/boardDelete', (req,res,next) => {
    firebase.database().ref('board/' + req.query.brdno).remove();
    res.redirect('boardList');
});
 
module.exports = router;