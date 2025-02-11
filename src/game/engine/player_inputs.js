import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../entities/colisionMap.js";
import { Explosion } from "../entities/bomb.js";

const player = document.querySelector(".player");
const container = document.querySelector(".game-container");

let position = {
  x: playerInfos.positionX,
  y: playerInfos.positionY,
};

export let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
};

let startTime;
let previousTime;
const moveSpeed = playerInfos.moveSpeed;

const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

function canMove(newX, newY) {
  return !walls.some((wall) =>
    wall.checkCollision(newX, newY, playerInfos.width, playerInfos.height)
  );
}

// Function to update the player position
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

  // Detect which key is being pressed
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

  // Appliquer les limites
  position.x = Math.max(0, Math.min(position.x, boundaryX));
  position.y = Math.max(0, Math.min(position.y, boundaryY));

  player.style.transform = `translate(${position.x}px, ${position.y}px)`;

  requestAnimationFrame(updatePosition);
}

// Event listener when a key is pressed
export function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key) && !window.isPaused) {
    keys[event.key] = true;
    event.preventDefault();

    // Instantiate a new bomb class whenever the player press the spacebar
  } else if (event.key === " " && playerInfos.bomb != playerInfos.maxBomb) {
    new Explosion(
      position.x - playerInfos.width / 3,
      position.y - playerInfos.height / 3
    );
    playerInfos.bomb++;
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
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

requestAnimationFrame(updatePosition);
