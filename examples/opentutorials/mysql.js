const mysql = require('mysql');
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'test'
});

connection.connect();

connection.query('SELECT * FROM t_o_data', (err, result, fields) => {
    if (err) throw err;

    console.log(result);
});

connection.end();