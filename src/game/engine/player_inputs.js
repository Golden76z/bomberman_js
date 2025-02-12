import { playerInfos } from '../constants/player_infos.js';
import { walls } from '../engine/mapGeneration.js';
import { Explosion } from '../entities/bomb.js';
import { updateTileMap } from '../constants/levels.js'

const player = document.querySelector('.player');
const container = document.querySelector('.game-container');

let position = {
  x: playerInfos.positionX,
  y: playerInfos.positionY,
};

export let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
  z: false,
  q: false,
  s: false,
  d: false,
};

let startTime;
let previousTime;
const moveSpeed = playerInfos.moveSpeed;

const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

// Modified canMove function to use hitbox
function canMove(newX, newY) {
  return !walls.some((wall) =>
    wall.checkCollision(
      newX,
      newY,
      playerInfos.width,
      playerInfos.height
    )
  );
}

// Modified updatePosition function to handle centered hitbox
function updatePosition(timestamp) {
  if (startTime === undefined) {
    startTime = timestamp;
  }

  const elapsed = timestamp - (previousTime || timestamp);
  previousTime = timestamp;

  if (window.isPaused) {
    return;
  }

  let newX = position.x;
  let newY = position.y;
  let isMoving = false;

  // Check X-axis movement
  if (keys.ArrowRight || keys.d) {
    newX = position.x + moveSpeed * elapsed;
    if (canMove(newX, position.y)) {
      position.x = newX;
    }
    isMoving = true;
  }
  if (keys.ArrowLeft || keys.q) {
    newX = position.x - moveSpeed * elapsed;
    if (canMove(newX, position.y)) {
      position.x = newX;
    }
    isMoving = true;
  }

  // Check Y-axis movement
  if (keys.ArrowUp || keys.z) {
    newY = position.y - moveSpeed * elapsed;
    if (canMove(position.x, newY)) {
      position.y = newY;
    }
    isMoving = true;
  }
  if (keys.ArrowDown || keys.s) {
    newY = position.y + moveSpeed * elapsed;
    if (canMove(position.x, newY)) {
      position.y = newY;
    }
    isMoving = true;
  }

  // Apply boundaries
  position.x = Math.max(0, Math.min(position.x, boundaryX));
  position.y = Math.max(0, Math.min(position.y, boundaryY));

  // Apply position, accounting for sprite being larger than hitbox
  player.style.transform = `translate(${position.x}px, ${position.y}px)`;

  // Update animations
  updatePlayerAnimation();

  requestAnimationFrame(updatePosition);
}

// Function to update character selection
export function updateCharacter(index) {
  playerInfos.characterIndex = index;
  const player = document.querySelector('.player');
  player.classList.remove('character-0', 'character-1');
  player.classList.add(`character-${index}`);
}

// Modified updatePlayerAnimation function
function updatePlayerAnimation() {
  const player = document.querySelector('.player');

  // Remove all animation classes first
  player.classList.remove(
    'facing-down', 'facing-up', 'facing-left', 'facing-right',
    'idle-down', 'idle-up', 'idle-left', 'idle-right'
  );

  // Make sure character class is applied
  player.classList.remove('character-0', 'character-1');
  player.classList.add(`character-${playerInfos.characterIndex}`);

  // Add appropriate animation class based on movement
  if (keys.ArrowRight || keys.d) {
    player.classList.add('facing-right');
  } else if (keys.ArrowLeft || keys.q) {
    player.classList.add('facing-left');
  } else if (keys.ArrowUp || keys.z) {
    player.classList.add('facing-up');
  } else if (keys.ArrowDown || keys.s) {
    player.classList.add('facing-down');
  } else {
    // Add idle animation based on last direction
    // You'll need to track last direction
    player.classList.add('idle-down'); // Default idle state
  }
}

// Initial character setup
updateCharacter(playerInfos.characterIndex);

// Event listener when a key is pressed
export function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key) && !window.isPaused) {
    keys[event.key] = true;
    event.preventDefault();

    // Instantiate a new bomb class whenever the player press the spacebar
  } else if (event.key === ' ' && playerInfos.bomb != playerInfos.maxBomb) {
    new Explosion(position.x - playerInfos.width / 3, position.y - playerInfos.height / 3);
    updateTileMap(position.x, position.y)
    playerInfos.bomb++
  }
}

// Event listener when a key is released
export function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    event.preventDefault();
  }
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

requestAnimationFrame(updatePosition);
