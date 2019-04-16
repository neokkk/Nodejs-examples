const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    console.log('서버 실행');

    fs.readFile('./server1.html', (err, data) => {
        if(err)
            throw err;
        res.end(data);
    });
}).listen(8080);

server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기중입니다.');
});
// node는 에러에 취약하다. 그래서 매번 체크 해주는 것이 좋다.
server.on('error', (error) => {
    console.error(error);
});