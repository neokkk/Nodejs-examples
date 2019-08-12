const WebSocket = require('ws');

module.exports = server => {
    const wss = new WebSocket.Server({ server }); // http와 wss 포트 공유

    wss.on('connection', (ws, req) => { // event 기반
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // proxy 전 ip, 최종 ip

        console.log('클라이언트 접속', ip);
        ws.on('message', message => {
            console.log(message);
        });

        ws.on('error', error => {
            console.log(error);
        });

        ws.on('close', () => {
            console.log('클라이언트 접속 해제');
            clearInterval(ws.interval);
        });

        const interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        }, 3000);

        ws.interval = interval;
    });
}