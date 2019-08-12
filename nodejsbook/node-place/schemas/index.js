const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = () => {
    const connect = () => {
        if (NODE_ENV !== 'production') mongoose.set('debug', true);

        mongoose.connect(MONGO_URL, {
            dbName: 'nplace'
        }, error => {
            if (error) console.error('mongodb connection error', error);
            else console.log('mongodb connect!');
        });
    };

    connect();

    mongoose.connection.on('error', error => {
        console.error('mongodb connection error', error);
    });

    mongoose.connection.on('disconnected', () =>{
        console.error('mongodb disconnected. try reconnect');
        connect();
    });

    require('./favorite');
    require('./history');
}