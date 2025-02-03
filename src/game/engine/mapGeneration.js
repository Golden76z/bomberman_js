import { MAP_1, MAP_2, MAP_3, MAP_4, MAP_5 } from '../constants/levels.js'
import { gameInfos } from '../entities/game_state.js'

// Creating an array storing all the maps
const allMaps = [MAP_1, MAP_2, MAP_3, MAP_4, MAP_5]

// Function to create a map depending on the game state
function createMap(mapArray) {
  console.log(typeof mapArray);

  const gameMap = document.getElementById('gameMap');
  const player = gameMap.querySelector('.player');
  const info = gameMap.querySelector('.info');
  const coordinates = gameMap.querySelector('.coordinates');

  // Clear existing tiles but keep player, info, and coordinates
  const tiles = gameMap.querySelectorAll('.tile');
  tiles.forEach(tile => tile.remove());

  mapArray.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
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
createMap(allMaps[gameInfos.level - 1]);
