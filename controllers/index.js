"use strict";

const express = require('express')
    , router = express.Router();

router.use('/', require('./home.js'));
router.use('/api', require('./api.js'));

module.exports = router;