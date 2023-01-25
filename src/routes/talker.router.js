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
  rateMoreValidation,
  talkerDelete,
  filteredTalkers,
} = require('../utils/talkerUtils');

const router = express.Router();

router.get('/talker', async (_req, res) => {
    const talkers = await getTalkers();
    res.status(200).json(talkers);
});

router.get('/talker/search', tokenValidationMiddleware, async (req, res) => {
  const { q } = req.query;
  const talkers = await getTalkers();
  const filter = await filteredTalkers(q);
  if (!q) return res.status(200).json(talkers);
  if (!filter.length) return res.status(200).json([]);
  return res.status(200).json(filter);
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
  rateMoreValidation,
  async (req, res) => {
    const allTalkers = await getTalkers();
    const newTalker = { id: allTalkers[allTalkers.length - 1].id + 1, ...req.body };
    await writeTalkers([...allTalkers, newTalker]);
    res.status(201).json({ ...newTalker });
},
);

router.put(
  '/talker/:id',
  tokenValidationMiddleware,
  nameValidationMiddleware,
  ageValidationMiddleware,
  talkValidationMiddleware,
  watchedValidationMiddleware,
  rateValidationMiddleware,
  rateMoreValidation,
  async (req, res) => {
    const { id } = req.params;
    const allTalkers = await getTalkers();
    let filteredTalker = allTalkers.find((talker) => Number(talker.id) === Number(id));
    filteredTalker = { id: JSON.parse(id), ...req.body };
    const newTalkers = allTalkers.filter((item) => Number(item.id) !== Number(id));
    newTalkers.push({ id, ...filteredTalker });
    await writeTalkers(newTalkers);

    return res.status(200).json({ id, ...filteredTalker });
  },
  );

router.delete('/talker/:id', tokenValidationMiddleware, async (req, res) => {
  const { id } = req.params;
  await talkerDelete(Number(id));
  res.status(204).json({ message: 'usuario deletado' });
});

module.exports = router;
