module.exports = (server, app) => {
    const io = require('socket.io')(server, { path: '/socket.io' });
    
    app.set('io', io);

    io.on('connection', socket => { // req.cookies, req.session 접근 불가. 접근하려면 io.use 미들웨어 연결
        const req = socket.request;
        const { headers: { referer } } = req;

        console.log(referer);
        const roomId = referer.split('/')[referer.split('/').length - 1];

        socket.join(roomId);
        socket.on('disconnect', () => {
            socket.leave(roomId);
        });
    });
}