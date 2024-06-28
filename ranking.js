const fs = require('fs');
const path = require('path');

let players = [];

const loadPlayers = () => {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'config', 'players.json'), 'utf-8');
    players = JSON.parse(data);
  } catch (err) {
    console.error('Error reading players.json:', err);
  }
};

const savePlayers = () => {
  try {
    fs.writeFileSync(path.join(__dirname, 'config', 'players.json'), JSON.stringify(players, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing players.json:', err);
  }
};

const getRanking = () => {
  return players
    .filter(player => player.active)
    .sort((a, b) => b.points - a.points);
};

const sendRanking = (ws) => {
  loadPlayers();
  const ranking = getRanking();
  ws.send(JSON.stringify({ type: 'ranking', ranking }));
};

module.exports = {
  sendRanking
};
