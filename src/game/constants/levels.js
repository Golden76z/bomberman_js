import { gameInfos } from '../constants/game.js';
import { createWalls } from '../entities/colisionMap.js'
import { createMap, walls } from '../engine/mapGeneration.js'
import { playerInfos } from './player_infos.js';
import { Explosion } from '../entities/bomb.js'

let allMaps = null;
const activeBombPositions = new Map();

export let MAP_1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 1],
  [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 2, 2, 2, 3, 2, 2, 2, 0, 1],
  [1, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1],
  [1, 2, 2, 0, 2, 2, 2, 0, 2, 2, 1],
  [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1],
  [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_2 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 2, 0, 0, 0, 2, 0, 3, 1],
  [1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1],
  [1, 0, 2, 0, 2, 2, 2, 0, 2, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 3, 2, 2, 2, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 2, 0, 2, 2, 2, 0, 2, 0, 1],
  [1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1],
  [1, 3, 0, 2, 0, 0, 0, 2, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_3 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 2, 3, 2, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 2, 2, 4, 2, 2, 2, 0, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 2, 2, 0, 2, 2, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 2, 3, 2, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_4 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 2, 2, 0, 2, 3, 2, 0, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 3, 2, 0, 2, 2, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_5 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1],
  [1, 2, 2, 0, 2, 0, 2, 0, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 0, 2, 0, 2, 2, 1],
  [1, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1],
  [1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_6 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Function to update the map values
function updateMaps(maps) {
  MAP_1.length = 0;
  MAP_1.push(...maps[0]);

  MAP_2.length = 0;
  MAP_2.push(...maps[1]);

  MAP_3.length = 0;
  MAP_3.push(...maps[2]);

  MAP_4.length = 0;
  MAP_4.push(...maps[3]);

  MAP_5.length = 0;
  MAP_5.push(...maps[4]);

  MAP_6.length = 0;
  MAP_6.push(...maps[5]);
}

export let maps = [MAP_1, MAP_2, MAP_3, MAP_4, MAP_5, MAP_6]

// New function to place a bomb
export function placeBomb(x, y) {
  // Initialize allMaps if needed
  if (!allMaps) {
    allMaps = [
      [...MAP_1],
      [...MAP_2],
      [...MAP_3],
      [...MAP_4],
      [...MAP_5],
      [...MAP_6]
    ];
  }

  const currentMap = allMaps[gameInfos.level - 1];

  // Calculate bomb position on map
  let currentPosX = Math.floor(x % Math.floor(gameInfos.width / gameInfos.width_tiles));
  let currentPosY = Math.floor(y % Math.floor(gameInfos.height / gameInfos.height_tiles));

  if (currentPosX > gameInfos.width / gameInfos.width_tiles / 2) {
    currentPosX = Math.floor(x / Math.floor(gameInfos.width / gameInfos.width_tiles)) + 1;
  } else {
    currentPosX = Math.floor(x / Math.floor(gameInfos.width / gameInfos.width_tiles));
  }

  if (currentPosY > gameInfos.height / gameInfos.height_tiles / 2) {
    currentPosY = Math.floor(y / Math.floor(gameInfos.height / gameInfos.height_tiles)) + 1;
  } else {
    currentPosY = Math.floor(y / Math.floor(gameInfos.height / gameInfos.height_tiles));
  }

  const bombKey = `${currentPosX},${currentPosY}`;

  // Check if there's already a bomb at this position
  if (!activeBombPositions.has(bombKey)) {
    // Place bomb on map
    currentMap[currentPosY][currentPosX] = 3;

    // Create new Explosion instance
    const explosion = new Explosion(x, y);

    // Store bomb data
    activeBombPositions.set(bombKey, {
      explosion,
      mapX: currentPosX,
      mapY: currentPosY,
      map: currentMap
    });

    // Set up a listener for when the explosion is removed
    const checkExplosion = setInterval(() => {
      if (!explosion.element || !explosion.element.parentNode) {
        // Explosion is finished, handle the map updates
        handleExplosion(currentPosX, currentPosY, currentMap);
        activeBombPositions.delete(bombKey);
        clearInterval(checkExplosion);
      }
    }, 100); // Check every 100ms
  }
}

// Helper function to handle explosion effects on the map
function handleExplosion(x, y, map) {
  // Clear the bomb
  map[y][x] = 0;

  // Handle explosion in all directions
  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
  ];

  directions.forEach(([dy, dx]) => {
    for (let i = 1; i <= playerInfos.bombLength; i++) {
      const newY = y + (dy * i);
      const newX = x + (dx * i);

      if (newY >= 0 && newY < map.length &&
        newX >= 0 && newX < map[0].length &&
        map[newY][newX] !== 1) {

        if (map[newY][newX] === 2) {
          map[newY][newX] = 0;
        }
      } else {
        break;
      }
    }
  });

  // Update walls and map
  walls.length = 0;
  walls.push(...createWalls(map));
  createMap(map);
  updateMaps(allMaps);
}

// Optional: function to check if a position has a bomb
export function hasBomb(x, y) {
  return activeBombPositions.has(`${x},${y}`);
}

// Integrate with your existing pause/resume system
export function pauseAllBombs() {
  for (const bombData of activeBombPositions.values()) {
    bombData.explosion.pause();
  }
}

export function resumeAllBombs() {
  for (const bombData of activeBombPositions.values()) {
    bombData.explosion.resume();
  }
}

// Export pause/resume functions so they can be called from your game pause system
// export { pauseExplosion, resumeExplosion };

// export const MAP_1 = [
//   [1,1,1,1,1,1,1,1,1,1,1],
//   [1,0,2,2,0,0,0,2,2,0,1],
//   [1,0,1,1,1,2,1,1,1,0,1],
//   [1,0,2,0,2,2,2,0,2,0,1],
//   [1,1,1,1,0,1,0,1,1,1,1],
//   [1,0,0,2,2,3,2,2,0,0,1],
//   [1,1,1,1,0,1,0,1,1,1,1],
//   [1,0,2,0,2,2,2,0,2,0,1],
//   [1,0,1,1,1,2,1,1,1,0,1],
//   [1,0,2,2,0,0,0,2,2,0,1],
//   [1,1,1,1,1,1,1,1,1,1,1]
// ];
