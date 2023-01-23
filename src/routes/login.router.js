const express = require('express');
const generateToken = require('../utils/cryptoUtils');
const loginMiddleware = require('../utils/loginUtils');

const router = express.Router();

router.post('/login', loginMiddleware, (_req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
});

module.exports = router;
