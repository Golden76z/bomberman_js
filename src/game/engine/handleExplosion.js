import { playerInfos } from "../constants/player_infos.js";
import { walls } from "../engine/mapGeneration.js";
import { Wall } from '../entities/colisionMap.js'
import { updateScore } from "./ui_scoring.js";
import { maps, updateMultipleMaps } from '../constants/levels.js';
import { gameInfos } from '../constants/game.js';
import { getTilesCoordinates } from '../engine/getTileCoordinates.js';
import { Explosion } from "../entities/bomb.js";
import { ExplosionAnimation } from '../entities/explosion_effect.js'
import { checkLevel } from "./checkLevel.js";
import { canSpawnPowerUp, powerUps, generateRandomPowerUp, applyPowerUp, powerUpStyles } from "./powerups.js";
import { aiController } from "./player_inputs.js";

export const activeBombPositions = new Map();

const ANIMATION_DURATION = 700;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.textContent = powerUpStyles;
document.head.appendChild(styleSheet);

// Updated function to check if either player or AI can pick up the powerup
export function canPickPowerUp(actor, powerUpElement) {
  const actorInfo = actor === 'player' ? playerInfos : aiController.playerInfos;
  const tileSize = gameInfos.width / gameInfos.width_tiles;

  // Get actor's tile position
  let coordinates = getTilesCoordinates(actorInfo.positionX, actorInfo.positionY)
  const actorTileX = coordinates[0];
  const actorTileY = coordinates[1];

  // Get powerup's tile position
  const powerupRect = powerUpElement.getBoundingClientRect();
  const powerupTileX = Math.floor(parseInt(powerUpElement.style.left) / tileSize);
  const powerupTileY = Math.floor(parseInt(powerUpElement.style.top) / tileSize);

  return actorTileX === powerupTileX && actorTileY === powerupTileY;
}

export function spawnPowerUpWithAnimation(tileX, tileY) {
  const gameContainer = document.getElementById('gameMap');
  const tileSize = gameInfos.width / gameInfos.width_tiles;

  const powerUpElement = document.createElement('div');
  powerUpElement.className = 'powerup';
  powerUpElement.style.left = `${tileX * tileSize}px`;
  powerUpElement.style.top = `${tileY * tileSize}px`;
  powerUpElement.style.width = `${tileSize}px`;
  powerUpElement.style.height = `${tileSize}px`;

  // Select powerup type
  const availablePowerUps = { ...powerUps };
  const powerUpType = Object.keys(availablePowerUps)[generateRandomPowerUp()];
  powerUpElement.dataset.type = powerUpType;
  powerUpElement.style.backgroundImage = `url('../images/powerups/${powerUpType}.png')`;
  powerUpElement.style.backgroundSize = 'contain';

  gameContainer.appendChild(powerUpElement);

  // Start appear animation
  requestAnimationFrame(() => {
    powerUpElement.classList.add('active');
  });

  let isBeingCollected = false;

  // Check for both player and AI collision
  const checkCollision = setInterval(() => {
    // Check player collision
    if (canPickPowerUp('player', powerUpElement) && !isBeingCollected) {
      collectPowerUp(powerUpElement, 'player', checkCollision);
      isBeingCollected = true;
    }

    // // Check AI collision
    // const aiElement = document.querySelector('.ai-player');
    // if (aiElement && canPickPowerUp("ai", powerUpElement) && !isBeingCollected) {
    //   collectPowerUp(powerUpElement, window.aiController, checkCollision);
    //   isBeingCollected = true;
    // }
  }, 100);

  // Remove after 10 seconds if not collected
  setTimeout(() => {
    if (powerUpElement.parentNode && !isBeingCollected) {
      powerUpElement.classList.remove('active');
      powerUpElement.classList.add('pickup');

      setTimeout(() => {
        if (powerUpElement.parentNode) {
          powerUpElement.remove();
        }
      }, 300);

      clearInterval(checkCollision);
    }
  }, 10000);
}

function collectPowerUp(powerUpElement, collector, checkInterval) {
  // Play pickup animation
  powerUpElement.classList.remove('active');
  powerUpElement.classList.add('pickup');

  // Apply powerup after animation starts
  const powerUpType = powerUpElement.dataset.type;
  applyPowerUp(collector, powerUpType);

  // Remove element after animation
  setTimeout(() => {
    if (powerUpElement.parentNode) {
      powerUpElement.remove();
    }
    clearInterval(checkInterval);
  }, 300);
}

function removeWallsInRange(x, y, walls, map, ownerBombLength) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const wallsToRemove = [];
  const powerUpSpawnPoints = [];

  // Check the bomb's position itself first
  if (map[y][x] === 0) {
    const centerWall = Wall.allWalls.find(wall =>
      wall.tileX === x && wall.tileY === y && wall.type === 3
    );
    if (centerWall) {
      wallsToRemove.push(centerWall);
      powerUpSpawnPoints.push({ x: centerWall.tileX, y: centerWall.tileY });
    }
  }

  // Check in all four directions
  directions.forEach(([dy, dx]) => {
    for (let i = 1; i <= ownerBombLength; i++) {
      const newY = y + dy * i;
      const newX = x + dx * i;

      if (newY < 0 || newY >= map.length || newX < 0 || newX >= map[0].length) {
        break;
      }

      const wall = Wall.allWalls.find(wall =>
        wall.tileX === newX && wall.tileY === newY
      );

      if (wall) {
        if (wall.type === 1) {
          break;
        } else if (wall.type === 3 && !wallsToRemove.includes(wall)) {
          wallsToRemove.push(wall);
          powerUpSpawnPoints.push({ x: wall.tileX, y: wall.tileY });
        }
      }
    }
  });

  // Remove walls and spawn powerups
  wallsToRemove.forEach((wall) => {
    wall.remove();
    const indexInWallsArray = walls.indexOf(wall);
    if (indexInWallsArray !== -1) {
      walls.splice(indexInWallsArray, 1);
    }

    if (wall.tileX !== undefined && wall.tileY !== undefined) {
      map[wall.tileY][wall.tileX] = 0;
    }
  });

  // Handle powerup spawning for each destroyed wall
  powerUpSpawnPoints.forEach(point => {
    if (canSpawnPowerUp()) {
      spawnPowerUpWithAnimation(point.x, point.y);
    }
  });

  return wallsToRemove.length;
}

// Updated handleExplosion function with improved debugging and safety
export function handleExplosion(x, y, map, owner) {
  let ownerBombLength = owner === "player" ? playerInfos.bombLength : 1;

  // Check for player damage
  if (playerInfos.hearts > 0 && isInExplosionRange(
    x, y,
    playerInfos.positionX,
    playerInfos.positionY,
    ownerBombLength
  )) {
    handlePlayerDamage();
  }

  // Check for AI damage
  for (let i = 0; i < aiController.length; i++) {
    if (aiController[i] && !aiController[i].disabled && isInExplosionRange(
      x, y,
      aiController[i].position.x,
      aiController[i].position.y,
      ownerBombLength
    )) {
      handleAIDamage(i);
    }
  }

  // Safety check
  if (y >= map.length || x >= map[0].length) {
    return;
  }

  // Clear the bomb
  map[y][x] = 0;

  // Get map dimensions and calculate tile size
  const gameContainer = document.getElementById('gameMap');
  if (!gameContainer) {
    return;
  }

  const tileSize = gameInfos.width / gameInfos.width_tiles;

  // Create container for explosion animations if it doesn't exist
  let container = document.getElementById('explosion-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'explosion-container';
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    gameContainer.appendChild(container);
  }

  // Create center explosion
  const centerExplosion = new ExplosionAnimation(x, y, tileSize, 'center');
  container.appendChild(centerExplosion.element);

  // Handle explosion in all directions
  const directions = [
    { dx: -1, dy: 0, dir: 'left' },
    { dx: 1, dy: 0, dir: 'right' },
    { dx: 0, dy: -1, dir: 'up' },
    { dx: 0, dy: 1, dir: 'down' }
  ];

  // First pass: Show explosion animations and mark walls for explosion
  directions.forEach(({ dx, dy, dir }) => {

    for (let i = 1; i <= ownerBombLength; i++) {
      const newY = y + dy * i;
      const newX = x + dx * i;

      // Validate coordinates are within map bounds
      if (
        newY < 0 ||
        newY >= map.length ||
        newX < 0 ||
        newX >= map[0].length
      ) {
        break; // Stop if we're out of bounds
      }

      // Debug what tile type we're on
      // console.log(`  Map value at position: ${map[newY][newX]}`);

      // Find wall at these coordinates
      const wall = Wall.allWalls.find(w =>
        w.tileX === newX && w.tileY === newY
      );

      if (wall) {
        if (wall.type === 1 || wall.type === 2) {
          break; // Stop this direction if we hit an indestructible wall
        } else if (wall.type === 3) {
          wall.explode(); // Add red filter effect
        }
      }

      // Safely calculate if this is the end position
      const nextY = newY + dy;
      const nextX = newX + dx;

      // First check if the next position is in bounds
      const isNextPositionOutOfBounds =
        nextY < 0 ||
        nextY >= map.length ||
        nextX < 0 ||
        nextX >= map[0].length;

      // Then check if it's blocked (but only if it's in bounds)
      const isNextPositionBlocked = isNextPositionOutOfBounds || map[nextY][nextX] === 1;

      // Determine if this is the end of the explosion
      const isEnd = i === ownerBombLength ||
        (i < ownerBombLength && isNextPositionBlocked);

      const explosion = new ExplosionAnimation(newX, newY, tileSize, dir, isEnd);
      container.appendChild(explosion.element);

      // Stop if hit a wall
      const wallAtPosition = Wall.allWalls.find(w => w.tileX === newX && w.tileY === newY);
      if (wallAtPosition && (wallAtPosition.type === 1 || wallAtPosition.type === 2)) {
        break;
      }
    }
  });

  // Remove the walls and update the map
  const count = removeWallsInRange(x, y, walls, map, ownerBombLength);

  if (count > 0) {
    updateMultipleMaps(maps);
    updateScore(500 * count);
  }

  // Clean up container after animation
  setTimeout(() => {
    if (container && document.contains(container) && !container.hasChildNodes()) {
      container.remove();
    }
  }, ANIMATION_DURATION + 100);
}

// Function to place a bomb on the map
export function placeBomb(x, y, owner) {
  // Initialize maps if needed
  if (!maps) {
    maps = [
      [...MAP_1],
      [...MAP_2],
      [...MAP_3],
      [...MAP_4],
      [...MAP_5],
      [...MAP_6],
    ];
  }

  let currentMap = maps[gameInfos.level - 1];

  // Calculate bomb position on map
  let coordinates = getTilesCoordinates(x, y)

  const bombKey = `${coordinates[0]},${coordinates[1]}`;

  // Check if there's already a bomb at this position
  if (!activeBombPositions.has(bombKey)) {
    currentMap[coordinates[1]][coordinates[0]] = 0;

    // Create new Explosion instance
    const explosion = new Explosion(x, y, owner);

    // Store bomb data
    activeBombPositions.set(bombKey, {
      explosion,
      mapX: coordinates[0],
      mapY: coordinates[1],
      map: currentMap,
    });

    const checkExplosion = setInterval(() => {
      if (!explosion.element || !explosion.element.parentNode) {
        // Explosion is finished, handle the map updates
        handleExplosion(coordinates[0], coordinates[1], currentMap, owner);
        activeBombPositions.delete(bombKey);
        clearInterval(checkExplosion);
        currentMap = maps[gameInfos.level - 1];

        // Check if the map is cleared and load the next map
        // setTimeout(() => {
        //   checkLevel(currentMap)
        // }, 1200)
      }
    }, 100); // Check every 100ms

    // Store bomb data WITH the interval ID
    activeBombPositions.set(bombKey, {
      explosion,
      mapX: coordinates[0],
      mapY: coordinates[1],
      map: currentMap,
      checkExplosionInterval: checkExplosion  // Store the interval ID here
    });
  }
}

// Optional: function to check if a position has a bomb
export function hasBomb(x, y) {
  return activeBombPositions.has(`${x},${y}`);
}

// Integrate with your existing pause/resume system
export function pauseAllBombs() {
  for (const bombData of activeBombPositions.values()) {
    bombData.explosion.pause();
  }
}

export function resumeAllBombs() {
  for (const bombData of activeBombPositions.values()) {
    bombData.explosion.resume();
  }
}

function isInExplosionRange(explosionX, explosionY, targetX, targetY, explosionLength) {
  // Convert pixel positions to tile coordinates
  const targetTileX = Math.floor(targetX / gameInfos.tileSize);
  const targetTileY = Math.floor(targetY / gameInfos.tileSize);

  // Check if target is in cross pattern from explosion, accounting for explosion length
  for (let i = 0; i <= explosionLength; i++) {
    // Check horizontal line
    if (targetTileY === explosionY && (
      targetTileX === explosionX + i ||
      targetTileX === explosionX - i
    )) {
      return true;
    }

    // Check vertical line
    if (targetTileX === explosionX && (
      targetTileY === explosionY + i ||
      targetTileY === explosionY - i
    )) {
      return true;
    }
  }

  return false;
}

function handlePlayerDamage() {
  if (!playerInfos.invulnerable) {
    if (playerInfos.extraHeart > 0) {
      playerInfos.extraHeart--;
    } else {
      playerInfos.hearts--;
    }
    updateScore(0)

    // Make player invulnerable briefly
    playerInfos.invulnerable = true;
    const playerElement = document.querySelector('.player');
    if (playerElement) {
      playerElement.style.opacity = '0.5';
    }

    // Reset invulnerability after 2 seconds
    setTimeout(() => {
      playerInfos.invulnerable = false;
      if (playerElement) {
        playerElement.style.opacity = '1';
      }
    }, 2000);

    // Optional: Add visual feedback
    if (playerElement) {
      playerElement.style.animation = 'damage 0.5s';
      setTimeout(() => {
        playerElement.style.animation = '';
      }, 500);
    }
  }
}

function handleAIDamage(index) {
  if (aiController.length == 0) return;

  const currentAI = aiController[index];
  if (!currentAI) return;

  currentAI.aiInfos.health--;

  // Get the specific AI element using its unique ID
  const aiElement = document.querySelector(`.ai-player-${currentAI.id}`);

  if (currentAI.aiInfos.health <= 0) {
    // Remove the specific AI element
    if (aiElement) {
      aiElement.remove();
    }

    // Disabling the ai if its health reaches 0
    currentAI.aiInfos.health = 0;
    currentAI.disabled = true;
  } else {
    // Visual effect if it takes damage without being killed
    if (aiElement) {
      // Add damage animation class
      aiElement.style.animation = 'damage 0.5s';
      setTimeout(() => {
        aiElement.style.animation = '';
      }, 500);
    }
  }

  // Count remaining active AIs
  const remainingAIs = aiController.filter(ai => !ai.disabled).length;

  // If no AIs remain, proceed to next level
  if (remainingAIs === 0) {
    const currentMap = maps[gameInfos.level - 1];
    checkLevel(currentMap);
  }
}

// Add damage animation to existing styles
const damageStyles = `
@keyframes damage {
  0% { filter: brightness(100%); }
  50% { filter: brightness(200%) saturate(200%) hue-rotate(345deg); }
  100% { filter: brightness(100%); }
}`;

const styleSheetDamage = document.createElement('style');
styleSheetDamage.textContent = damageStyles;
document.head.appendChild(styleSheetDamage);
