import { playerInfos } from '../constants/player_infos.js'
import { walls, updateTile } from '../engine/mapGeneration.js'

// Helper function to handle explosion effects on the map
export function handleExplosion(x, y, map) {
  // Clear the bomb
  map[y][x] = 0;

  // Handle explosion in all directions
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  let count = 0
  directions.forEach(([dy, dx]) => {
    for (let i = 1; i <= playerInfos.bombLength; i++) {
      const newY = y + (dy * i);
      const newX = x + (dx * i);

      if (newY >= 0 && newY < map.length &&
        newX >= 0 && newX < map[0].length &&
        map[newY][newX] !== 1) {

        if (map[newY][newX] === 3) {
          count++
          map[newY][newX] = 0;
          updateTile(newX, newY, 0)
        }
      } else {
        break;
      }
    }
  });

  if (count != 0) {
    // Update walls and map
    removeWallsInRange(x, y, walls, map);
  }
}

function removeWallsInRange(x, y, walls, map) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  // Collect walls to remove
  const wallsToRemove = [];

  // Check the bomb's position itself first
  if (map[y][x] === 0) {
    walls.forEach(wall => {
      if (wall.tileX === x && wall.tileY === y) {
        wallsToRemove.push(wall);
      }
    });
  }

  // Check in all four directions
  directions.forEach(([dy, dx]) => {
    for (let i = 1; i <= playerInfos.bombLength; i++) {
      const newY = y + dy * i;
      const newX = x + dx * i;

      if (
        newY < 0 || newY >= map.length ||
        newX < 0 || newX >= map[0].length ||
        map[newY][newX] === 1
      ) {
        break; // Stop if we hit an indestructible wall
      }

      if (map[newY][newX] === 0) {
        walls.forEach(wall => {
          if (wall.tileX === newX && wall.tileY === newY) {
            wallsToRemove.push(wall);
          }
        });
      }
    }
  });

  // Remove walls from Wall.allWalls and walls array
  wallsToRemove.forEach(wall => {
    wall.remove();
    const indexInWallsArray = walls.indexOf(wall);
    if (indexInWallsArray !== -1) {
      walls.splice(indexInWallsArray, 1);
    }
  });
}
