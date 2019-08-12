const express = require('express'),
      multer = require('multer'),
      path = require('path'),
      fs = require('fs'),
      schedule = require('node-schedule');

const { Good, Auction, User, sequelize } = require('../models'),
      { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const goods = await Good.findAll({ where: { soldId: null } });

        res.render('main', {
            title: 'Nauction',
            goods,
            loginError: req.flash('loginError')
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입',
        joinError: req.flash('joinError'),
    });
});
  
router.get('/good', isLoggedIn, (req, res) => {
    res.render('good', { title: '상품 등록' });
});

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/good/:id', isLoggedIn, async (req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.findOne({
                where: { id: req.params.id },
                include: {
                    model: User,
                    as: 'owner'
                }
            }),
            Auction.findAll({
                where: { goodId: req.params.id },
                include: { model: User },
                order: [['bid', 'ASC']]
            })
        ]);

        res.render('auction', {
            title: good.name,
            good,
            auction,
            auctionError: req.flash('auctionError')
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/good', isLoggedIn, upload.single('img'), async (req, res, next) => {
    try {
        const { name, price } = req.body;

        const end = new Date();
        const good = await Good.create({
            ownerId: req.user.id,
            name,
            img: req.file.filename,
            price,
        });

        end.setDate(end.getDate() + 1);

        schedule.scheduleJob(end, async () => { // 서버 메모리에 스케줄 저장, 서버가 꺼지면 사라짐
            const success = await Auction.findOne({
                where: { goodId: good.id },
                order: [['bid', 'DESC']]
            });

            await Good.update({ soldId: success.userId }, { where: { id: good.id } });
            await User.update({ money: sequelize.literal(`money - ${success.bid}`) }, {
                where: { id: success.userId }
            });
        });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
    try {
        const { bid, msg } = req.body;
        const good = await Good.findOne({
            where: { id : req.params.id },
            include: { model: Auction },
            order: [[{ model: Auction }, 'bid', 'DESC']]
        });

        if (good.price > bid) {
            res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
        }

        if (new Date(good.createdAt).valueOf() + (24 * 60 * 60 * 1000) < new Date()) {
            res.status(403).send('경매가 이미 종료되었습니다.');
        }

        if (good.auctions[0] && good.auctions[0].bid >= bid) {
            res.status(403).send('이전 입찰가보다 높아야 합니다.');
        }

        const result = await Auction.create({
            bid,
            msg,
            userId: req.user.id,
            goodId: req.params.id
        });

        req.app.get('io').to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick
        });

        res.send('ok');
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/list', isLoggedIn, async (req, res, next) => {
    try {
        const goods = await Good.findAll({
            where: { soldId: req.user.id },
            include: { model: Auction },
            order: [[{ model: Auction }, 'bid', 'DESC']]
        });

        res.render('list', { title: '낙찰 목록', goods });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;