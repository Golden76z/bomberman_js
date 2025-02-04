import { MAP_1, MAP_2, MAP_3, MAP_4, MAP_5, MAP_6 } from './constants/levels.js'
import { gameInfos } from './constants/game.js';

const allMaps = [MAP_1, MAP_2, MAP_3, MAP_4, MAP_5, MAP_6]
let currentMap = allMaps[gameInfos.level - 1]

// Wall class to define their coordinates
class Wall {
  constructor(positionX, positionY, type) {
    this.width = gameInfos.width / gameInfos.width_tiles;
    this.height = gameInfos.height / gameInfos.height_tiles;
    this.positionX = positionX * this.width;
    this.positionY = positionY * this.height;
    this.type = type;
  }

  // Function to check the colision with the player coordinates
  checkCollision(x, y, playerWidth, playerHeight) {
    return (
      x < this.positionX + this.width &&
      x + playerWidth > this.positionX &&
      y < this.positionY + this.height &&
      y + playerHeight > this.positionY
    );
  }
}

// Create walls from map
function createWalls(map) {
  const walls = [];
  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1 || cell === 2) {
        walls.push(new Wall(colIndex, rowIndex, cell));
      }
    });
  });
  return walls;
}

// Create walls array from your current map
export const walls = createWalls(currentMap);
