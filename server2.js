const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
    cookie
        .split(',')
        .map(y => y.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, y]) => {
            acc[k.trim()] = decodeURIComponent(y);
            return acc;
        }, {});

const session = {

};

const server = http.createServer((req, res) => {
    //req.headers.cookie
    const cookies = parseCookies(req.headers.cookie);

    // form 확인
    if(req.url.startsWith('/login')){
        const { query } = url.parse(req.url);
        const { name } = qs.parse(query);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);

        const randomInt = +new Date();
        session[randomInt] = {
            name,
            expires,
        };

        res.writeHead(302, {
            Location: '/',
            'Set-Cookie' : `session=${randomInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
        });
        res.end();        
    } else if(cookies.session && session[cookies.session] && session[cookies.session].expires > new Date()){
            res.writeHead(200, { 'Content-Type' : 'text/html; charset=utf-8' });
            res.end(`${session[cookies.session].name}님 안녕하세요.`);
        } else {
         fs.readFile('./server2.html', (err, data) => {
            res.end(data);
        });
    };
}).listen(8081);

server.on('listening', () => {
    console.log('8081번 포트에서 서버 대기중입니다.');
});
// node는 에러에 취약하다. 그래서 매번 체크 해주는 것이 좋다.
server.on('error', (error) => {
    console.error(error);
});