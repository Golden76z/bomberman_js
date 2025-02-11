import { gameInfos } from '../constants/game.js';
import { maps } from '../constants/levels.js'

let currentMap = maps[gameInfos.level - 1]

// Wall class to define their coordinates
class Wall {
  // Constructor, variable declarations
  constructor(positionX, positionY, type) {
    this.width = gameInfos.width / gameInfos.width_tiles;
    this.height = gameInfos.height / gameInfos.height_tiles;
    this.positionX = positionX * this.width;
    this.positionY = positionY * this.height;
    this.type = type;
  }

  // Function to check the colision with the player coordinates
  checkCollision(x, y, playerWidth, playerHeight) {
    // returns true if the player is contained within the 2 walls intervals
    return (
      x < this.positionX + this.width &&
      x + playerWidth > this.positionX &&
      y < this.positionY + this.height &&
      y + playerHeight > this.positionY
    );
  }
}

// Create walls object whenever we encounter a 0 or a 1
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
