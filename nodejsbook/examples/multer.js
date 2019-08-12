const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      multer = require('multer');

const app = express();

// 업로드 디렉토리 설정
const tmpDir = path.join(__dirname, 'tmp'),
      pubDir = path.join(__dirname, 'pub'),
      uploader = multer({ dest: tmpDir });

// 서버 실행
app.listen(3000, () => {
    console.log('server start!');
});

app.get('/', (req, res, next) => {
    res.send(
        `
            <form method="POST" action="/" enctype="multipart/form-data">
                <input type="file" name="file" /><br>
                <input type="submit" value="upload">
            </form>
        `
    )
});

// 정적 파일 제공
app.use('/pub', express.static(pubDir));

app.post('/', uploader.single('file') , (req, res, next) => {
    console.log('get file');
    console.log(req.file);
    console.log('file name : ', req.file.originalname);
    console.log('file path : ', req.file.path);

    if (req.file.mimetype !== 'image/png') {
        res.send('PNG 이미지만 업로드 할 수 있습니다.');
        return
    }

    const filename = req.file.filename + '.png';
    const des = pubDir + '/' + filename;

    fs.rename(req.file.path, des, () => {
        res.send(`file uploaded! <br> <img src="/pub/${filename}" />`);
    });
});