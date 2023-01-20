const express = require('express');

const router = express.Router();

const talkerRouter = require('./talker.router');

router.use(talkerRouter);

module.exports = router;
