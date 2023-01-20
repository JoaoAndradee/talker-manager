const fs = require('fs').promises;
const path = require('path');

const getTalkers = async () => {
  try {
    const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
    const talkers = JSON.parse(data);
    return talkers;
  } catch (error) {
    console.error(`Vixe, algo deu errado: ${error}`);
  }
};

module.exports = {
  getTalkers,
};
