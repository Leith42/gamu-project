const express = require('express')
    , router = express.Router();

router.get('/', (req, res) => {
    res.render('home/home', {
        pageTitle: 'Monkey Clash'
    });
});

module.exports = router;