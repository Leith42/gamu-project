"use strict";

const express = require('express')
    , router = express.Router();

router.use('/', require('./home.js'));
router.use('/game', require('./game.js'));

module.exports = router;