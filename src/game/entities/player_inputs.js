// Import of player object storing all infos
import { playerInfos } from './player_infos.js'
import { canMoveVerticaly, canMoveHorizontaly } from './colisionDetection.js'

// Getting html div for the player and container
const player = document.querySelector('.player');
const container = document.querySelector('.game-container');
// const coordinates = document.querySelector('.coordinates');

// Player initial position based on playerInfos
let position = { x: playerInfos.positionX, y: playerInfos.positionY };
let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false
};

let startTime;
let previousTime;
const moveSpeed = playerInfos.moveSpeed;
// Setting the walls to limit the movements
const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

function updatePosition(timestamp) {
  if (startTime === undefined) {
    startTime = timestamp;
  }

  const elapsed = timestamp - (previousTime || timestamp);
  previousTime = timestamp;

  // Calculate movement based on elapsed time (checking if key value is true)
  if (keys.ArrowRight && canMoveHorizontaly(position.x)) position.x += moveSpeed * elapsed;
  if (keys.ArrowLeft && canMoveHorizontaly(position.x)) position.x -= moveSpeed * elapsed;
  if (keys.ArrowUp && canMoveVerticaly(position.y)) position.y -= moveSpeed * elapsed;
  if (keys.ArrowDown && canMoveVerticaly(position.y)) position.y += moveSpeed * elapsed;

  // Apply boundaries
  position.x = Math.max(0, Math.min(position.x, boundaryX));
  position.y = Math.max(0, Math.min(position.y, boundaryY));
  // Also ensure that position doesn't go below 0 and over max width/height

  // Update player position in css
  player.style.transform = `translate(${position.x}px, ${position.y}px)`;
  // coordinates.textContent = `Position: (${Math.round(position.x)}, ${Math.round(position.y)})`;

  // Continue animation loop (request next animation frame)
  requestAnimationFrame(updatePosition);
}

// Set key value to true when pressed
function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
    event.preventDefault();
  }
}

// Set key value to false when pressed
function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    event.preventDefault();
  }
}

// Event listeners when a key is pressed or released
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Start the animation loop
requestAnimationFrame(updatePosition);
