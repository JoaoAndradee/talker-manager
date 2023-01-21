const express = require('express');

const router = express.Router();

const talkerRouter = require('./talker.router');
const loginRouter = require('./login.router');

router.use(talkerRouter);
router.use(loginRouter);

module.exports = router;
