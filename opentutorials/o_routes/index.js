const express = require('express'),
      router = express.Router(),
      template = require('../template2');

router.get('/', (req, res) => {
    const title = 'Welcome',
            description = 'Hello, Node.js',
            list = template.list(req.list),
            html = template.html(title, list,
            `<h2>${title}</h2>${description}
             <p><img src='/o_image/unsplash1.jpg' style='width:50%'></p>`,
            `<a href="/topic/create">create</a>`
    ); 
    res.send(html);
});

module.exports = router;