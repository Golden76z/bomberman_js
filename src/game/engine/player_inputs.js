import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../entities/colisionMap.js";
import { Explosion } from "../entities/bomb.js";
import { updateTileMap } from "../constants/levels.js";

const player = document.querySelector(".player");
const container = document.querySelector(".game-container");

let position = {
  x: playerInfos.positionX,
  y: playerInfos.positionY,
};

let animationFrameId;

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
let previousTime = null;
const moveSpeed = playerInfos.moveSpeed;

const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

function canMove(newX, newY) {
  return !walls.some((wall) =>
    wall.checkCollision(newX, newY, playerInfos.width, playerInfos.height)
  );
}

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

  if (keys.ArrowRight || keys.d) {
    newX = position.x + moveSpeed * elapsed;
    if (canMove(newX, position.y)) position.x = newX;
  }
  if (keys.ArrowLeft || keys.q) {
    newX = position.x - moveSpeed * elapsed;
    if (canMove(newX, position.y)) position.x = newX;
  }
  if (keys.ArrowUp || keys.z) {
    newY = position.y - moveSpeed * elapsed;
    if (canMove(position.x, newY)) position.y = newY;
  }
  if (keys.ArrowDown || keys.s) {
    newY = position.y + moveSpeed * elapsed;
    if (canMove(position.x, newY)) position.y = newY;
  }

  position.x = Math.max(0, Math.min(position.x, boundaryX));
  position.y = Math.max(0, Math.min(position.y, boundaryY));

  player.style.transform = `translate(${position.x}px, ${position.y}px)`;

  animationFrameId = requestAnimationFrame(updatePosition);
}

window.addEventListener("resumeGame", () => {
  console.log("💡 Reprise détectée : Animation du joueur réactivée");
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  requestAnimationFrame(updatePosition);
});
export function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key) && !window.isPaused) {
    keys[event.key] = true;
    event.preventDefault();
  } else if (event.key === " " && playerInfos.bomb != playerInfos.maxBomb) {
    new Explosion(
      position.x - playerInfos.width / 3,
      position.y - playerInfos.height / 3
    );
    updateTileMap(position.x, position.y);
    playerInfos.bomb++;
  }
}

export function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    event.preventDefault();
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

requestAnimationFrame(updatePosition);

window.addEventListener("resumeGame", () => {
  console.log("💡 Reprise détectée : Animation du joueur réactivée");
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  previousTime = null;
  requestAnimationFrame(updatePosition);
});
