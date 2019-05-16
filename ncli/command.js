#! /usr/bin/env node

const program = require('commander'),
      fs = require('fs'),
      path = require('path'),
      readline = require('readline'),
      inquirer = require('inquirer'),
      chalk = require('chalk');

let trigger = false;

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

const makeTemplate = (type, name, directory) => {
    mkdirp(directory);

    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);

        if (exist(pathToFile)) console.error(chalk.bold.red('해당 파일이 이미 존재합니다.'));
        else {
            fs.writeFileSync(pathToFile, htmlTemplate); // 한번만 실행되는 경우에는 sync 메서드를 사용해도 괜찮다
            console.log(pathToFile, chalk.yellow('생성 완료'));
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);

        if (exist(pathToFile)) console.error(chalk.bold.red('해당 파일이 이미 존재합니다.'));
        else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, chalk.yellow('생성 완료'));
        }
    } else console.error(chalk.bold.red('html 또는 express-router 둘 중 하나를 입력하세요.'));
}

const copyFile = (name, dir) => {
    if (exist(name)) {
        mkdirp(dir);
        fs.copyFileSync(name, path.join(dir, name));
        console.log(`${name} 파일이 복사되었습니다.`);
    } else {
        console.error('복사할 원본 파일이 존재하지 않습니다.');
    }
}

const removeFile = dir => {
    if (exist(dir)) {
        try { // 인자가 폴더일 경우
            const dir2 = fs.readdirSync(dir);
            dir2.forEach(dir3 => {
                removeFile(path.join(dir, dir3));
            });
            fs.rmdirSync(dir);
        } catch (e) { // 인자가 파일일 경우
            fs.unlinkSync(dir);
            console.log(`${dir} 파일을 삭제하였습니다.`);
        }
    } else console.error('파일 또는 폴더가 존재하지 않습니다.');
}

program
    .version('0.0.1', '-v, --version')
    .usage('[options]');
    
program
    .command('template <type>')
    .usage('--name <name> --path [path]') // <필수> [선택] 
    .description('템플릿을 생성합니다.')
    .alias('tmpl')
    .option('-n, --name <name>', '파일명을 입력하세요', 'index') // --옵션 -단축옵션
    .option('-d, --directory [path]', '생성 경로를 입력하세요.', '.')
    .action((type, options) => {
        makeTemplate(type, options.name, options.directory);
        trigger = true;
    });

program
    .command('copy <name> <directory>')
    .usage('<name> <directory>')
    .description('파일을 복사합니다.')
    .action((name, directory) => {
        copyFile(name, directory);
        trigger = true;
    });

program
    .command('rm <directory>')
    .usage('<directory>')
    .description('해당 경로와 하위 파일들을 모두 삭제합니다.')
    .action(directory => {
        removeFile(directory);
        trigger = true;
    })

program
    .command('*', { noHelp: true })
    .action(() => {
        console.log('해당 명령어를 찾을 수 없습니다.');
        program.help();
        trigger = true;
    });

program.parse(process.argv);

if (!trigger) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: '템플릿 종류를 선택하세요.',
            choices: ['html', 'express-router']
        }, {
            type: 'input',
            name: 'name',
            message: '파일의 이름을 입력하세요.',
            default: 'index'
        }, {
            type: 'input',
            name: 'directory',
            message: '파일이 위치할 폴더의 경로를 입력하세요.',
            default: '.'
        }, {
            type: 'confirm',
            name: 'confirm',
            message: '생성하시겠습니까?'
        }
    ])
    .then(answers => {
        if (answers.confirm) makeTemplate(answers.type, answers.name, answers.directory);
    })
}