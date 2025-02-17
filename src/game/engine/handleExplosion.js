import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../engine/mapGeneration.js";
import { Wall } from '../entities/colisionMap.js'
import { updateScore } from "./ui_scoring.js";
import { maps, updateMultipleMaps } from '../constants/levels.js';
import { gameInfos } from '../constants/game.js';
import { getTilesCoordinates } from '../engine/getTileCoordinates.js';
import { Explosion } from "../entities/bomb.js";
import { ExplosionAnimation } from '../entities/explosion_effect.js'

const activeBombPositions = new Map();

const ANIMATION_DURATION = 700;

function removeWallsInRange(x, y, walls, map) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Collect walls to remove
  const wallsToRemove = [];

  // Check the bomb's position itself first
  if (map[y][x] === 0) {
    const centerWall = Wall.allWalls.find(wall =>
      wall.tileX === x && wall.tileY === y && wall.type === 3
    );
    if (centerWall) {
      wallsToRemove.push(centerWall);
    }
  }

  // Check in all four directions
  directions.forEach(([dy, dx]) => {
    for (let i = 1; i <= playerInfos.bombLength; i++) {
      const newY = y + dy * i;
      const newX = x + dx * i;

      if (
        newY < 0 ||
        newY >= map.length ||
        newX < 0 ||
        newX >= map[0].length
      ) {
        break; // Stop if we're out of bounds
      }

      // Find wall at these coordinates
      const wall = Wall.allWalls.find(wall =>
        wall.tileX === newX && wall.tileY === newY
      );

      if (wall) {
        if (wall.type === 1) {
          break; // Stop this direction if we hit an indestructible wall
        } else if (wall.type === 3 && !wallsToRemove.includes(wall)) {
          wallsToRemove.push(wall);
        }
      }
    }
  });

  // Remove walls
  wallsToRemove.forEach((wall) => {
    // Call the wall's remove method to handle both DOM and array cleanup
    wall.remove();

    // Also remove from the walls array passed to this function
    const indexInWallsArray = walls.indexOf(wall);
    if (indexInWallsArray !== -1) {
      walls.splice(indexInWallsArray, 1);
    }

    // Update the map
    if (wall.tileX !== undefined && wall.tileY !== undefined) {
      map[wall.tileY][wall.tileX] = 0;
    }
  });

  return wallsToRemove.length; // Return count of removed walls
}

// Updated handleExplosion function with responsive animation
export function handleExplosion(x, y, map) {
  // Clear the bomb
  map[y][x] = 0;

  // Get map dimensions and calculate tile size
  const gameContainer = document.getElementById('gameMap');
  const tileSize = gameInfos.width / gameInfos.width_tiles; // Use the same tile size as walls

  // Create container for explosion animations if it doesn't exist
  let container = document.getElementById('explosion-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'explosion-container';
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    gameContainer.appendChild(container);
  }

  // Create center explosion
  const centerExplosion = new ExplosionAnimation(x, y, tileSize, 'center');
  container.appendChild(centerExplosion.element);

  // Handle explosion in all directions
  const directions = [
    { dx: -1, dy: 0, dir: 'left' },
    { dx: 1, dy: 0, dir: 'right' },
    { dx: 0, dy: -1, dir: 'up' },
    { dx: 0, dy: 1, dir: 'down' }
  ];

  // First pass: Show explosion animations and mark walls for explosion
  directions.forEach(({ dx, dy, dir }) => {
    for (let i = 1; i <= playerInfos.bombLength; i++) {
      const newY = y + dy * i;
      const newX = x + dx * i;

      if (
        newY >= 0 &&
        newY < map.length &&
        newX >= 0 &&
        newX < map[0].length
      ) {
        const wall = Wall.allWalls.find(w =>
          w.tileX === newX && w.tileY === newY
        );

        if (wall) {
          if (wall.type === 1 || wall.type === 2) {
            break; // Stop this direction if we hit an indestructible wall
          } else if (wall.type === 3) {
            wall.explode(); // Add red filter effect
          }
        }

        // Create explosion animation
        const isEnd = i === playerInfos.bombLength ||
          (i < playerInfos.bombLength &&
            (map[newY + dy][newX + dx] === 1 ||
              newY + dy < 0 ||
              newY + dy >= map.length ||
              newX + dx < 0 ||
              newX + dx >= map[0].length));

        const explosion = new ExplosionAnimation(newX, newY, tileSize, dir, isEnd);
        container.appendChild(explosion.element);
      } else {
        break;
      }
    }
  });

  // Remove the walls and update the map
  const count = removeWallsInRange(x, y, walls, map);
  if (count > 0) {
    updateMultipleMaps(maps);
    updateScore(500 * count);
  }

  // Clean up container after animation
  setTimeout(() => {
    if (container && !container.hasChildNodes()) {
      container.remove();
    }
  }, ANIMATION_DURATION + 100);
}

// Function to place a bomb on the map
export function placeBomb(x, y) {
  // Initialize maps if needed
  if (!maps) {
    maps = [
      [...MAP_1],
      [...MAP_2],
      [...MAP_3],
      [...MAP_4],
      [...MAP_5],
      [...MAP_6],
    ];
  }

  const currentMap = maps[gameInfos.level - 1];

  // Calculate bomb position on map
  let coordinates = getTilesCoordinates(x, y)

  const bombKey = `${coordinates[0]},${coordinates[1]}`;

  // Check if there's already a bomb at this position
  if (!activeBombPositions.has(bombKey)) {
    currentMap[coordinates[1]][coordinates[0]] = 0;

    // Create new Explosion instance
    const explosion = new Explosion(x, y);

    // Store bomb data
    activeBombPositions.set(bombKey, {
      explosion,
      mapX: coordinates[0],
      mapY: coordinates[1],
      map: currentMap,
    });

    // Set up a listener for when the explosion is removed
    const checkExplosion = setInterval(() => {
      if (!explosion.element || !explosion.element.parentNode) {
        // Explosion is finished, handle the map updates
        handleExplosion(coordinates[0], coordinates[1], currentMap);
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
