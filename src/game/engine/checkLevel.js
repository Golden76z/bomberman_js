import { gameInfos, updateGameLevel, updateWallStyles, gameContainerStyles } from "../constants/game.js"
import { createWalls } from "../entities/colisionMap.js"
import { createMap } from "./mapGeneration.js"
import { walls } from "./mapGeneration.js"
import { maps } from "../constants/levels.js"
import { gameLoop } from "./gameLoop.js"
import { getBoundaryX, getBoundaryY, updatePosition } from "./player_inputs.js"
import { updatePlayerAnimation, position } from "./player_inputs.js"
import { activeBombPositions } from "./handleExplosion.js"
import { Wall } from "../entities/colisionMap.js"

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
    console.error("No map provided to checkLevel");
    currentMap = maps[gameInfos.level - 1];
  }

  // Check if all destroyable walls are gone
  let count = 0;
  for (let i = 0; i < walls.length; i++) {
    if (walls[i].type === 3) {
      count++;
    }
  }

  console.log(`Checking level completion: ${count} destroyable walls remaining`);

  if (count === 0) {
    console.log(`Level ${gameInfos.level} complete! Moving to next level.`);

    // Clear any active bombs before changing level
    activeBombPositions.forEach((bombData, key) => {
      if (bombData.explosion && bombData.explosion.element) {
        bombData.explosion.element.remove();
      }
      activeBombPositions.delete(key);
    });

    // Increment level
    gameInfos.level++;
    updateGameLevel();

    // Get the new map
    const newMap = maps[gameInfos.level - 1];
    if (!newMap) {
      console.error(`No map found for level ${gameInfos.level}`);
      return;
    }

    console.log(`New map dimensions: ${newMap.length}x${newMap[0].length}`);

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
    updatePlayerAnimation();

    // Recalculate boundaries
    getBoundaryX();
    getBoundaryY();

    // Restart game loop
    gameLoop.start(updatePosition);
  }
}
