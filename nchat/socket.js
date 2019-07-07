const SocketIO = require('socket.io');

module.exports = server => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', socket => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);

        socket.on('reply', data => { // ws.message
            console.log(data);
        });

        socket.on('error', err => {
            console.error(err);
        });

        socket.on('disconnect', () => { // ws.close
            console.log('클라이언트 접속 해제.', ip, socket.id);
            clearInterval(socket.interval);
        });

        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO!');
        }, 3000);
    });
}