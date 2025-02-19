import { gameInfos, updateGameLevel, updateWallStyles, gameContainerStyles } from "../constants/game.js"
import { createWalls } from "../entities/colisionMap.js"
import { createMap } from "./mapGeneration.js"
import { walls } from "./mapGeneration.js"
import { maps, originalMaps } from "../constants/levels.js"
import { gameLoop } from "./gameLoop.js"
import { getBoundaryX, getBoundaryY, updatePosition } from "./player_inputs.js"
import { updatePlayerAnimation, position } from "./player_inputs.js"
import { activeBombPositions } from "./handleExplosion.js"
import { Wall } from "../entities/colisionMap.js"
import { playerInfos } from "../constants/player_infos.js"

// Function to check if the number of wall is equal to 0 or not
export function checkWalls() {
  let count = 0
  for (let i = 0; i < walls.length; i++) {
    if (walls[i].type === 3) {
      count++
    }
  }
  if (count === 0) {
    return true
  } else {
    return false
  }
}

export function checkLevel(currentMap) {
  // Safety check - ensure we have a map
  if (!currentMap) {
    currentMap = maps[gameInfos.level - 1];
  }

  // Check if all destroyable walls are gone
  let count = 0;
  for (let i = 0; i < walls.length; i++) {
    if (walls[i].type === 3) {
      count++;
    }
  }

  // If we change level or restart a map
  if (count === 0 || gameInfos.restart) {

    // Clear any active bombs before changing level
    activeBombPositions.forEach((bombData, key) => {
      if (bombData.checkExplosionInterval) {
        clearInterval(bombData.checkExplosionInterval);
      }

      // Remove all the explosions elements
      if (bombData.explosion && bombData.explosion.element) {
        // Calling the remove method stored inside the bomb class
        bombData.explosion.remove();
      }

      // Delete from active bombs map
      activeBombPositions.delete(key);
    });

    // Increment level
    if (!gameInfos.restart) {
      gameInfos.level++;
    }
    gameInfos.restart = false
    updateGameLevel();

    // Get the new map
    const newMap = originalMaps[gameInfos.level - 1];
    if (!newMap) {
      return;
    }

    // Update game container
    const gameContainer = document.querySelector(".game-container");

    // Create new map and walls
    createMap(newMap);

    // Reset wall collection
    walls.length = 0;
    Wall.allWalls.length = 0; // Make sure to reset both arrays

    // Create fresh walls
    const newWalls = createWalls(newMap);
    walls.push(...newWalls);

    // Apply styles
    const styles = gameContainerStyles();
    for (const [key, value] of Object.entries(styles)) {
      gameContainer.style[key] = value;
    }
    updateWallStyles();

    // Reset player position
    position.x = 60;
    position.y = 60;
    playerInfos.maxBomb = 1
    playerInfos.bomb = 0
    playerInfos.bombLength = 1
    updatePlayerAnimation();

    // Recalculate boundaries
    getBoundaryX();
    getBoundaryY();

    // Restart game loop
    gameLoop.start(updatePosition);
  }
}
