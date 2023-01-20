const express = require('express');
const { getTalkers } = require('../utils/talkerService');

const router = express.Router();

router.get('/talker', async (_req, res) => {
    const talkers = await getTalkers();
    res.status(200).json(talkers);
});

module.exports = router;
