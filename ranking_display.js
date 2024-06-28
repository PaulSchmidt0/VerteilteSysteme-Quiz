const displayRanking = (ranking) => {
    const rankingContainer = document.getElementById('ranking-container');
    rankingContainer.innerHTML = '<h2>Leaderboard</h2>';
  
    ranking.slice(0, 3).forEach((player, index) => {
      const playerElement = document.createElement('div');
      playerElement.classList.add('leaderboard-entry');
      playerElement.innerHTML = `<strong>${index + 1}. ${player.name}</strong> - ${player.points} points`;
      rankingContainer.appendChild(playerElement);
    });
  
    if (ranking.length > 3) {
      const otherPlayers = ranking.slice(3);
      otherPlayers.forEach((player, index) => {
        const playerElement = document.createElement('div');
        playerElement.classList.add('leaderboard-entry');
        playerElement.innerHTML = `${index + 4}. ${player.name} - ${player.points} points`;
        rankingContainer.appendChild(playerElement);
      });
    }
  };
  
  const socket = new WebSocket('ws://127.0.0.1:4000');
  
  socket.onopen = () => {
    socket.send(JSON.stringify({ type: 'start' }));
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
  
    if (data.type === 'ranking') {
      displayRanking(data.ranking);
    }
  };
  
  document.getElementById('start-button').addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'start' }));
  });
  