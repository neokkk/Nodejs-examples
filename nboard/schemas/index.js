const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        // 배포용 설정이 아닐 경우 debug 설정
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

        mongoose.connect(
            "mongodb://nk:pswcompassnk@localhost:27017/admin",
            {
                dbName: "test_board",
                useNewUrlParser: true
            },
            err => {
                if (err) console.error('mongodb has errors', err);
                else console.log('mongodb connected success');
            }
        );
    }
    connect();

    mongoose.connection.once('open', () => {
        console.log('DB Connected!');
    });
    
    mongoose.connection.on('error', err => {
        console.error('DB has errors', err);
    });
    
    mongoose.connection.on('disconnected', err => {
        console.error('DB disconnected', err);
        connect();
    });
}
