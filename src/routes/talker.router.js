const express = require('express');
const { getTalkers } = require('../utils/talkerUtils');

const router = express.Router();

router.get('/talker', async (_req, res) => {
    const talkers = await getTalkers();
    res.status(200).json(talkers);
});

router.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalkers();
  const talkerFiltered = allTalkers.filter((talker) => talker.id === Number(id));
  if (talkerFiltered.length) {
    return res.status(200).json(...talkerFiltered);
  }
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

module.exports = router;
