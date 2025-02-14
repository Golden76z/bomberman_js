import { gameLoop } from "./gameLoop.js";
import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../engine/mapGeneration.js";
import { placeBomb } from "../constants/levels.js";

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
  z: false,
  q: false,
  s: false,
  d: false,
};

const moveSpeed = playerInfos.moveSpeed;
const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

function canMove(newX, newY) {
  return !walls.some((wall) =>
    wall.checkCollision(newX, newY, playerInfos.width, playerInfos.height)
  );
}

function updatePosition(deltaTime) {
  if (window.isPaused) return;

  const elapsed = deltaTime;
  let newX = position.x;
  let newY = position.y;
  let isMoving = false;

  // Movement calculations based on elapsed time
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

  // Update player position
  player.style.transform = `translate(${position.x}px, ${position.y}px)`;

  // Update animations
  updatePlayerAnimation();
}

export function updateCharacter(index) {
  playerInfos.characterIndex = index;
  const player = document.querySelector(".player");
  player.classList.remove("character-0", "character-1");
  player.classList.add(`character-${index}`);
}

function updatePlayerAnimation() {
  const player = document.querySelector(".player");

  player.classList.remove(
    "facing-down",
    "facing-up",
    "facing-left",
    "facing-right",
    "idle-down",
    "idle-up",
    "idle-left",
    "idle-right"
  );

  player.classList.remove("character-0", "character-1");
  player.classList.add(`character-${playerInfos.characterIndex}`);

  if (keys.ArrowRight || keys.d) {
    player.classList.add("facing-right");
  } else if (keys.ArrowLeft || keys.q) {
    player.classList.add("facing-left");
  } else if (keys.ArrowUp || keys.z) {
    player.classList.add("facing-up");
  } else if (keys.ArrowDown || keys.s) {
    player.classList.add("facing-down");
  } else {
    player.classList.add("idle-down");
  }
}

// Initial setup
updateCharacter(playerInfos.characterIndex);

export function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key) && !window.isPaused) {
    keys[event.key] = true;
    event.preventDefault();
  } else if (
    event.key === " " &&
    playerInfos.bomb != playerInfos.maxBomb &&
    !window.isPaused
  ) {
    // Place a bomb and center it
    placeBomb(
      position.x - playerInfos.width / 3,
      position.y - playerInfos.height / 3
    );
    playerInfos.bomb++;
  }
}

export function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    event.preventDefault();
  }
}

// Event listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Initialize and start the game loop
gameLoop.start(updatePosition);
