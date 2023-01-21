const express = require('express');
const generateToken = require('../utils/cryptoUtils');

const router = express.Router();

router.post('/login', (req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
});

module.exports = router;
