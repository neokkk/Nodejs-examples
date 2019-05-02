const express = require('express'),
      mysql = require('mysql');
      router = express.Router();

/* MySQL DB connect */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
});
db.connect();

/* GET memo listing. */
router.get('/', (req, res, next) => {
    db.query('SELECT * FROM t_n_memo', (err, result) => {
        if (err) throw err;
        if (result.length === 0)
            res.render('memo/input');
        else 
            res.render('memo/list', { result });
    });
});

// create
router.post('/create', (req, res, next) => {
    const postData = req.body;

    if (postData.memo_input !== '') {
        db.query('INSERT INTO t_n_memo (memo_text, memo_user, memo_date) VALUES (?, ?, Now())',
            [`${postData.memo_input}`, ''], (err, result) => {
                if (err) throw err;
        });
        res.redirect('/');
    }
});

// update
router.post('/update/:update_id', (req, res, next) => {

});

// delete
router.post('/delete/:delete_id', (req, res, next) => {

});

module.exports = router;