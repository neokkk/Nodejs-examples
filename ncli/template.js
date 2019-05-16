#! /usr/bin/env node

const fs = require('fs'),
      path = require('path'),
      readline = require('readline');

let rl = '',
    type = process.argv[2],
    name = process.argv[3],
    directory = process.argv[4] || '.';

const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Template</title>
</head>
<body>
    <h1>Hello</h1>
    <p>CLI</p>
</body>
</html>`

const routerTemplate = `const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;`

const exist = dir => {
    try {
        fs.accessSync(dir, fs.constants.F_OK || fs.constants.R_OK || fs.constants.W_OK);
        return true;
    } catch (e) { return false; }
}

const mkdirp = dir => {
    const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p => !!p);

    dirname.forEach((d, idx) => {
        const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);

        if (!exist(pathBuilder)) fs.mkdirSync(pathBuilder);
    }
)}

const makeTemplate = () => {
    mkdirp(directory);

    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);

        if (exist(pathToFile)) console.error('해당 파일이 이미 존재합니다.');
        else {
            fs.writeFileSync(pathToFile, htmlTemplate); // 한번만 실행되는 경우에는 sync 메서드를 사용해도 괜찮다
            console.log(pathToFile, '생성 완료');
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);

        if (exist(pathToFile)) console.error('해당 파일이 이미 존재합니다.');
        else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else console.error('html 또는 express-router 둘 중 하나를 입력해주세요.');
}

const dirAnswer = answer => {
    directory = (answer && answer.trim()) || '.';
    rl.close();
    makeTemplate();
}

const nameAnswer = answer => {
    if (!answer || !answer.trim()) {
        console.clear();
        console.log('파일명을 반드시 입력하셔야 합니다.');
        return rl.question('파일명을 입력하세요.', nameAnswer);
    }
    name = answer;
    return rl.question('저장할 경로를 설정하세요. (설정하지 않으면 현재 경로로 설정됩니다.)', dirAnswer);
}

const typeAnswer = answer => {
    if (answer !== 'html' && answer !== 'express-router') {
        console.clear();
        console.log('html 또는 express-router만 지원합니다.');
        return rl.question('어떤 템플릿이 필요하신가요?', typeAnswer);
    }
    type = answer;
    return rl.question('파일명을 입력하세요.', nameAnswer);
}

const program = () => {
    if (!type || !name) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.clear();
        rl.question('어떤 템플릿이 필요하신가요?', typeAnswer);

    } else {
        makeTemplate();
    }
}

program();