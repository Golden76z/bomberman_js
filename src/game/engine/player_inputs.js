import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../entities/colisionMap.js";

// Getting HTML elements
const player = document.querySelector(".player");
const container = document.querySelector(".game-container");

// Player initial position
let position = {
  x: playerInfos.positionX,
  y: playerInfos.positionY,
};

let keys = {
  ArrowRight: false,
  ArrowLeft: false,
  ArrowUp: false,
  ArrowDown: false,
};

let startTime;
let previousTime;
const moveSpeed = playerInfos.moveSpeed;

// Setting boundaries
const boundaryX = container.clientWidth - playerInfos.width;
const boundaryY = container.clientHeight - playerInfos.height;

// Check if movement is possible
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

  // Si le jeu est en pause, ne pas mettre à jour la position
  if (window.isPaused) {
    return;
  }

  // Calculer les nouvelles positions potentielles
  let newX = position.x;
  let newY = position.y;

  // Vérifier les déplacements
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

  // Mettre à jour la position du joueur dans le CSS
  player.style.transform = `translate(${position.x}px, ${position.y}px)`;

  // Continuer la boucle d'animation
  requestAnimationFrame(updatePosition);
}

// Gérer les événements de touche
export function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
    event.preventDefault(); // Empêcher le comportement par défaut de la touche (comme faire défiler la page)
  }
}

export function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
    event.preventDefault();
  }
}

// Ajouter les écouteurs d'événements de touche
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Commencer la boucle d'animation
requestAnimationFrame(updatePosition);
