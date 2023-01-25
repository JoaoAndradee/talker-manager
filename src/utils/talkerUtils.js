const fs = require('fs').promises;
const path = require('path');
const moment = require('moment');

const getTalkers = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const talkers = JSON.parse(data);
    return talkers;
  } catch (error) {
    console.error(`Vixe, algo deu errado: ${error}`);
  }
};

const writeTalkers = async (newTalker) => {
  await fs.writeFile(path.resolve(__dirname, '../talker.json'), JSON.stringify(newTalker));
};

const tokenValidationMiddleware = (req, res, next) => {
  const { authorization: token } = req.headers;
  if (!token) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (token.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const nameValidationMiddleware = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const ageValidationMiddleware = (req, res, next) => {
  const { age } = req.body;
  if (!age) return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const talkValidationMiddleware = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  next();
};

const watchedValidationMiddleware = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const dateFormat = 'DD/MM/YYYY';

  if (!watchedAt) return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  if (!moment(watchedAt, dateFormat, true).isValid()) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const rateValidationMiddleware = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate && rate !== 0) return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  next();
};

const rateMoreValidation = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!(rate >= 1 && rate <= 5) || !Number.isInteger(rate)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

const talkerDelete = async (id) => {
  const allTalkers = await getTalkers();
  const filteredTalkers = allTalkers.filter((talker) => Number(talker.id) !== Number(id));
  return writeTalkers(filteredTalkers);
};

const filteredTalkers = async (name) => {
  const allTalkers = await getTalkers();
  const filteredTalkersByName = allTalkers.filter((talker) => talker.name.includes(name));
  return filteredTalkersByName;
};

module.exports = {
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
};
