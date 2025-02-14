import { gameInfos } from '../constants/game.js';
import { Explosion } from '../entities/bomb.js'
import { handleExplosion } from '../engine/handleExplosion.js'

let allMaps = null;
const activeBombPositions = new Map();

export let MAP_1 = [
  [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
  [2, 0, 0, 3, 3, 3, 3, 3, 0, 0, 2],
  [2, 0, 1, 3, 1, 0, 1, 3, 1, 0, 2],
  [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
  [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
  [2, 0, 3, 3, 3, 3, 3, 3, 3, 0, 2],
  [2, 3, 1, 3, 1, 0, 1, 0, 1, 3, 2],
  [2, 3, 3, 0, 3, 3, 3, 0, 3, 3, 2],
  [2, 0, 1, 3, 1, 0, 1, 3, 1, 0, 2],
  [2, 0, 0, 3, 3, 3, 3, 3, 0, 0, 2],
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
    currentMap[currentPosY][currentPosX] = 0;

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
