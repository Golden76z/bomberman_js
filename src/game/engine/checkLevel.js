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
import { aiController } from "./player_inputs.js"
import { AIController } from "../entities/ai.js"

export function transitionToNextLevel() {
  return new Promise((resolve) => {
    // Create overlay element if it doesn't exist
    let overlay = document.querySelector('.level-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'level-transition-overlay';
      document.body.appendChild(overlay);

      // Add the CSS for the overlay
      const style = document.createElement('style');
      style.textContent = `
        .level-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: black;
          opacity: 0;
          z-index: 1000;
          pointer-events: none;
          transition: opacity 0.8s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }

    // Fade in
    overlay.style.opacity = '0';
    overlay.style.display = 'block';

    // Force reflow to ensure transition works
    void overlay.offsetWidth;

    // Start fade in
    overlay.style.opacity = '1';

    // Wait for fade in to complete
    setTimeout(() => {
      // Update level and map here while screen is black
      resolve();

      // Start fade out after a short delay
      setTimeout(() => {
        overlay.style.opacity = '0';

        // Remove overlay after fade out
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 500);
      }, 600); // Short delay before fade out starts
    }, 500); // Time for fade in
  });
}

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

  // If we change level or restart a map
  transitionToNextLevel()
  setTimeout(() => {
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
    playerInfos.hearts = 1
    updatePlayerAnimation();

    if (gameInfos.level == 1) {
      aiController.length = 0
      aiController.push(new AIController(100, 100, 1, walls))
    } else if (gameInfos.level == 2) {
      aiController.length = 0
      aiController.push(new AIController(100, 100, 1, walls))
      aiController.push(new AIController(550, 100, 1, walls))
    } else {
      aiController.length = 0
      aiController.push(new AIController(100, 100, 1, walls))
    }

    // Recalculate boundaries
    getBoundaryX();
    getBoundaryY();

    // Restart game loop
    gameLoop.start(updatePosition);
  }, 700)

}
