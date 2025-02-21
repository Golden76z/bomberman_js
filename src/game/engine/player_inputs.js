import { gameLoop } from "./gameLoop.js";
import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../engine/mapGeneration.js";
import { placeBomb } from "../engine/handleExplosion.js";
import { handleExplosionEffect } from '../entities/colisionMap.js'

const player = document.querySelector(".player");
const container = document.querySelector(".game-container");

export let position = {
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
const TILE_SIZE = 54; // Define tile size as a constant

// Convert boundaries to functions that calculate based on current map size
export function getBoundaryX() {
  const mapWidth = walls.length; // Assuming walls array length represents map width
  return (mapWidth * TILE_SIZE) - playerInfos.width;
}

export function getBoundaryY() {
  const mapHeight = walls[0]?.length || walls.length; // Assuming square map
  return (mapHeight * TILE_SIZE) - playerInfos.height;
}

function canMove(newX, newY) {
  const currentBoundaryX = getBoundaryX();
  const currentBoundaryY = getBoundaryY();

  // Add boundary checks here
  if (newX < 0 || newX > currentBoundaryX || newY < 0 || newY > currentBoundaryY) {
    return false;
  }

  return !walls.some((wall) =>
    wall.checkCollision(
      newX,
      newY,
      playerInfos.width,
      playerInfos.height
    )
  );
}


export function updatePosition(deltaTime) {
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

  // Apply boundaries using the functions
  position.x = Math.max(0, Math.min(position.x, getBoundaryX()));
  position.y = Math.max(0, Math.min(position.y, getBoundaryY()));

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

export function updatePlayerAnimation() {
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
    // Setting up player coordinate centered on his hitbox
    let x = position.x - playerInfos.width / 3
    let y = position.y - playerInfos.height / 3
    // Place a bomb and center it
    placeBomb(x, y);

    // Function to change the walls colors
    handleExplosionEffect(x, y)
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
