#! /usr/bin/env node

const program = require('commander'),
      inquirer = require('inquirer');

const { version } = require('./package'),
      { sequelize, Wallet } = require('./models');

program
    .version(version, '-v, --version')
    .usage('[options]');

// 수입
program
    .command('revenue <money> <desc>')
    .description('수입을 기록합니다.')
    .action(async (money, desc) => {
        await sequelize.sync(); // db 연결
        await Wallet.create({
            money: parseInt(money, 10),
            desc,
            type: true
        });
        console.log(`${money}원을 얻었습니다.`);
        await sequelize.close(); // db 종료
    });

// 지출
program
    .command('expense <money> <desc>')
    .description('지출을 기록합니다.')
    .action(async (money, desc) => {
        await sequelize.sync();
        await Wallet.create({
            money: parseInt(money, 10),
            desc,
            type: false
        });
        console.log(`${money}원을 잃었습니다.`);
        await sequelize.close();
    });

// 잔액
program
    .command('balance')
    .description('잔액을 표시합니다.')
    .action(async () => {
        await sequelize.sync();

        const logs = await Wallet.findAll({});
        const revenue = logs // 수입
            .filter(log => log.type === true)
            .reduce((acc, cur) => acc + cur.money, 0);
        const expense = logs // 지출
        .filter(log => log.type === false)
        .reduce((acc, cur) => acc + cur.money, 0);

        console.log(`${revenue - expense}원 남았습니다.`);
        await sequelize.close();
    });

// 명령어 오류 처리
program
    .command('*')
    .action(() => {
        console.log('알 수 없는 명령어입니다.');
    });

program.parse(process.argv);