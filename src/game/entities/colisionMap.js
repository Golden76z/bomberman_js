import { gameInfos } from '../constants/game.js';

// Wall class to define their coordinates
export class Wall {
  // Tableau statique pour stocker toutes les instances de la classe Wall
  static allWalls = [];

  // Constructor, variable declarations
  constructor(positionX, positionY, type) {
    this.width = gameInfos.width / gameInfos.width_tiles;
    this.height = gameInfos.height / gameInfos.height_tiles;
    this.positionX = positionX * this.width;
    this.positionY = positionY * this.height;
    this.type = type;

    // Ajouter l'objet au tableau des murs
    Wall.allWalls.push(this);
  }

  // Function to check the collision with the player coordinates
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
export function createWalls(map) {
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
