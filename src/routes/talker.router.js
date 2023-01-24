const express = require('express');
const {
  getTalkers,
  writeTalkers,
  tokenValidationMiddleware,
  nameValidationMiddleware,
  ageValidationMiddleware,
  talkValidationMiddleware,
  watchedValidationMiddleware,
  rateValidationMiddleware,
} = require('../utils/talkerUtils');

const router = express.Router();

router.get('/talker', async (_req, res) => {
    const talkers = await getTalkers();
    res.status(200).json(talkers);
});

router.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const allTalkers = await getTalkers();
  const talkerFiltered = allTalkers.find((talker) => talker.id === Number(id));
  if (talkerFiltered) {
    return res.status(200).json(talkerFiltered);
  }
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

router.post(
  '/talker',
  tokenValidationMiddleware,
  nameValidationMiddleware,
  ageValidationMiddleware,
  talkValidationMiddleware,
  watchedValidationMiddleware,
  rateValidationMiddleware,
  async (req, res) => {
    const allTalkers = await getTalkers();
    const newTalker = { id: allTalkers[allTalkers.length - 1].id + 1, ...req.body };
    await writeTalkers([...allTalkers, newTalker]);
    res.status(201).json({ ...newTalker });
},
);

module.exports = router;
