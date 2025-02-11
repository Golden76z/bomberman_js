import { gameInfos } from '../constants/game.js'
import { maps } from '../constants/levels.js'

// Function to create a map depending on the game state
function createMap(mapArray) {
  const gameMap = document.getElementById('gameMap');
  const player = gameMap.querySelector('.player');
  const info = gameMap.querySelector('.info');
  const coordinates = gameMap.querySelector('.coordinates');

  // Clear existing tiles but keep player
  const tiles = gameMap.querySelectorAll('.tile');
  tiles.forEach(tile => tile.remove());

  mapArray.forEach((row) => {
    row.forEach((cell) => {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      switch (cell) {
        case 1:
          tile.classList.add('wall');
          break;
        case 2:
          tile.classList.add('destructible');
          break;
        case 0:
        case 3:
          tile.classList.add('empty');
          break;
      }

      gameMap.appendChild(tile);
    });
  });

  // Ensure player stays on top by re-appending it
  if (player) gameMap.appendChild(player);
  if (info) gameMap.appendChild(info);
  if (coordinates) gameMap.appendChild(coordinates);
}

// Initialize the map depending on the game level
createMap(maps[gameInfos.level - 1]);
