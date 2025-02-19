import { gameInfos } from "../constants/game.js";
import { getTilesCoordinates } from '../engine/getTileCoordinates.js'
import { playerInfos } from "../constants/player_infos.js";

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

    // Create the wall element with data attributes
    this.element = document.createElement('div');
    this.element.className = type === 3 ? 'destructible' : 'indestructible';
    this.element.style.position = 'absolute';
    this.element.style.left = `${this.positionX}px`;
    this.element.style.top = `${this.positionY}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.backgroundSize = 'contain'; // Ensures the entire image fits in the div
    this.element.style.backgroundRepeat = 'no-repeat'; // Prevents tiling
    this.element.style.backgroundPosition = 'center'; // Centers the image if needed

    // Add data attributes for coordinates
    this.element.dataset.tileX = this.tileX;
    this.element.dataset.tileY = this.tileY;

    // Add to game board
    document.getElementById('gameMap').appendChild(this.element);

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
    const index = Wall.allWalls.findIndex((wall) => wall === this);
    if (index !== -1) {
      Wall.allWalls.splice(index, 1);
    }

    // Remove the style of the destroyable wall
    if (this.element) {
      this.element.classList.remove('destructible');
      this.element.classList.remove('exploding'); // Remove the exploding class if it exists
      this.element.classList.add('empty');

      // Optional: Clear any existing background or styles that were specific to the destructible wall
      this.element.style.backgroundImage = '';
      // Keep the position and size styles
    }
  }

  // Method to add a red filter on the destroyable walls
  explode() {
    if (this.element) {
      this.element.className = 'exploding';
    }
  }
}

// Function to handle explosion effect in all directions
export function handleExplosionEffect(centerX, centerY) {
  // Getting the x and y coordiantes on the tilemap with the pixels coordinates
  let coordinates = getTilesCoordinates(centerX, centerY)

  const directions = [
    [-1, 0], // up
    [1, 0],  // down
    [0, -1], // left
    [0, 1]   // right
  ];

  directions.forEach(([dy, dx]) => {
    for (let i = 1; i <= playerInfos.bombLength; i++) {
      const newY = coordinates[1] + (dy * i);
      const newX = coordinates[0] + (dx * i);

      // Find wall at these coordinates
      const wall = Wall.allWalls.find(wall =>
        wall.tileX === newX && wall.tileY === newY
      );

      if (wall) {
        // Stop this direction if we hit an indestructible wall
        if (wall.type === 1) {
          break;

          // Add the red filter on top of the destroyable wall
        } else if (wall.type === 3) {
          wall.explode();
        }
      }
    }
  });
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
