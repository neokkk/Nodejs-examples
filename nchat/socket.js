const SocketIO = require('socket.io'),
      axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, { path: '/socket.io' });

    app.set('io', io); // express 변수 저장 가져올 때는 req.app.get('io')

    io.use((socket, next) => { // express middleware를 socketIO에서 사용
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    // 네임 스페이스
    // io.of('/')
    const room = io.of('/room'),
          chat = io.of('/chat');

    room.on('connection', socket => {
        console.log('room namespace connect');

        socket.on('disconnect', () => {
            console.log('room namespace disconnect');
        });
    });

    chat.on('connection', socket => {
        console.log('chat namespace connect');

        const req = socket.request;
        const { headers: { referer } } = req;
        const roomId = referer
            .split('/')[referer.split('/').length - 1]
            .replace(/|?.+/, '');

        socket.join(roomId); // room in
        socket.to(roomId).emit('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하였습니다.`
        });

        socket.on('disconnect', () => {
            console.log('chat namespace disconnect');
            socket.leave(roomId); // room out

            // 인원이 없으면 방 없애기
            const currentRoom = socket.adapter.rooms[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;

            if (userCount === 0) {
                axios.delete(`http://localhost:8005/room/${roomId}`)
                     .then(() => console.log('방 제거 요청 성공'))
                     .catch(err => console.error(err));
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하였습니다.`
                });
            }
        });
    });
}