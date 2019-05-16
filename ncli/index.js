#! /usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin, // standard input on console
    output: process.stdout // standard output on console
});

console.clear();

const answerCallback = (answer) => {
    if (answer === 'y') {
        console.log('감사합니다!');
        rl.close();
    }
    else if (answer === 'n') {
        console.log('죄송합니다ㅠ');
        rl.close();
    }
    else {
        console.clear();
        console.log('y 또는 n만 입력하세요.');
        rl.question('재미 있으세요? (y/n)', answerCallback);
    }
}

rl.question('재미 있으세여? (y/n)', answerCallback);