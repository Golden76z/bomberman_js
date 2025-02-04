import { playerInfos } from '../constants/player_infos.js';
import { walls } from '../entities/colisionMap.js'

// Getting HTML elements
const player = document.querySelector('.player');
const container = document.querySelector('.game-container');

// Player initial position
let position = {
  x: playerInfos.positionX,
  y: playerInfos.positionY
};

let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false
};

let startTime;
let previousTime;
const moveSpeed = playerInfos.moveSpeed;

// Setting boundaries
const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

// Check if movement is possible
function canMove(newX, newY) {
  return !walls.some(wall =>
    wall.checkCollision(newX, newY, playerInfos.width, playerInfos.height)
  );
}

function updatePosition(timestamp) {
  if (startTime === undefined) {
    startTime = timestamp;
  }

  const elapsed = timestamp - (previousTime || timestamp);
  previousTime = timestamp;

  // Calculate potential new positions
  let newX = position.x;
  let newY = position.y;

  // Check movement with collision detection
  if (keys.ArrowRight) {
    newX = position.x + moveSpeed * elapsed;
    if (canMove(newX, position.y)) {
      position.x = newX;
    }
  }
  if (keys.ArrowLeft) {
    newX = position.x - moveSpeed * elapsed;
    if (canMove(newX, position.y)) {
      position.x = newX;
    }
  }
  if (keys.ArrowUp) {
    newY = position.y - moveSpeed * elapsed;
    if (canMove(position.x, newY)) {
      position.y = newY;
    }
  }
  if (keys.ArrowDown) {
    newY = position.y + moveSpeed * elapsed;
    if (canMove(position.x, newY)) {
      position.y = newY;
    }
  }

  // Apply boundaries
  position.x = Math.max(0, Math.min(position.x, boundaryX));
  position.y = Math.max(0, Math.min(position.y, boundaryY));

  // Update player position in CSS
  player.style.transform = `translate(${position.x}px, ${position.y}px)`;

  // Continue animation loop
  requestAnimationFrame(updatePosition);
}

// Key event handlers
function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    event.preventDefault();
  }
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Start animation loop
requestAnimationFrame(updatePosition);
