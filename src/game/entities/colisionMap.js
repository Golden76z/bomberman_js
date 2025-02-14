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
    this.tileX = positionX;
    this.tileY = positionY;

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

  remove() {
    // Remove the wall from the static Wall.allWalls array
    const index = Wall.allWalls.findIndex(wall => wall === this);
    if (index !== -1) {
      Wall.allWalls.splice(index, 1);
    }

    // Optional: if you have some DOM element representing the wall, remove it as well
    if (this.element) {
      this.element.remove(); // Assuming there's a DOM element representing the wall
    }
  }
}


// Create walls object whenever we encounter a 0 or a 1
export function createWalls(map) {
  const walls = [];
  map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 1 || cell === 2 || cell === 3) {
        walls.push(new Wall(colIndex, rowIndex, cell));
      }
    });
  });
  return walls;
}
