const express = require('express')
    , router = express.Router();

router.get('/', (req, res) => {
    res.render('home/home', {
        pageTitle: 'Clash of Woman'
    });
});

module.exports = router;