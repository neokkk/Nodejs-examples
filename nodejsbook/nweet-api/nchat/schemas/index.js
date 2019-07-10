const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = () => {
    const connect = () => {
        mongoose.connect(MONGO_URL, {
            dbName: 'nchat',
        }, err => {
            if (err) console.log('MongoDB connect error', err);
            else console.log('MongoDB connect success');
        });
    }
    connect();

    mongoose.connection.on('error', err => {
        console.error('MongoDB connect error', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.error('MongoDB is disconnected. Try reconnect');
        connect();
    });

    require('./chat');
    require('./room');
}