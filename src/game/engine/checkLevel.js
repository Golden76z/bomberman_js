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
import { showStory } from "../animationText.js"
import { exitToMenu } from "./pause.js"

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

  // First, start the transition
  // This code runs when screen is black (between fade-in and fade-out)
  if (gameInfos.level == 1) {
    const story = "In the heart of Blastron, chaos looms. You, the last Bomber, must reclaim the city!";

    // Call nextMap during black screen

    gameInfos.pause = true
    console.log("test");

    showStory(story, () => {
      nextMap();
      aiController.length = 0;
      aiController.push(new AIController(100, 100, 1, walls));
      updateBackground(1);
      gameInfos.pause = false
    });
  } else if (gameInfos.level == 2) {
    const story2 = `Level 2 - The Resistance Grows
        You've breached the outer defenses, but Pyron's forces are ready.Two enemies stand in your way, faster and more dangerous.Stay sharp and blast your way through!`;

    // Call nextMap during black screen
    setTimeout(() => {
      nextMap();
    }, 700)

    gameInfos.pause = true
    showStory(story2, () => {
      aiController.length = 0;
      aiController.push(new AIController(100, 100, 1, walls));
      aiController.push(new AIController(550, 100, 1, walls));
      updateBackground(2);
      gameInfos.pause = false
    });
  } else if (gameInfos.level == 3) {
    const story3 = `Final Level - Showdown with Pyron!
        The city's core is within reach, but Pyron won't go down without a fight. His elite guards block your path, and at the end, the warlord himself awaits. You've come too far to stop now. It's time to face your destiny!

        (Press any key to continue)`;

    // Call nextMap during black screen
    setTimeout(() => {
      nextMap();
    }, 700)

    gameInfos.pause = true
    showStory(story3, () => {
      aiController.length = 0;
      aiController.push(new AIController(100, 100, 3, walls));
      aiController.push(new AIController(760, 100, 2, walls));
      aiController.push(new AIController(100, 550, 2, walls));
      updateBackground(3);
      gameInfos.pause = false
    });
  } else {
    const endingStory = `Victory - Blastron is Free!

  The final explosion echoes through the city as Pyron falls. His reign of terror is over, and the heart of Blastron beats once more. The streets, once filled with chaos, now hum with the sounds of rebuilding and hope.

  You, the last Bomber, have done the impossible. The city's people cheer your name, and your legend will be told for generations. But this is not just your victory—it's a victory for all of Blastron. The city is free, and its future is bright.

  As the dust settles, you take a moment to reflect. The battles were fierce, the challenges great, but you never gave up. You faced the darkness and brought light back to Blastron.

  Thank you for playing, hero. Your journey may be over, but your legacy will live on forever.

  (Press any key to return to the main menu)`;
    gameInfos.level = 1
    showStory(endingStory, exitToMenu);
  }

  // Recalculate boundaries
  getBoundaryX();
  getBoundaryY();

  // Restart game loop
  gameLoop.start(updatePosition);
}


function updateBackground(level) {
  // Define background images for each level
  const backgrounds = {
    1: "url('../images/background_forest.gif')",
    2: "url('../images/background_cave.png')",
    3: "url('../images/background_lava.png')",
  };

  // Get the HTML element
  const html = document.documentElement;

  // Remove previous background to force update
  html.style.removeProperty("background-image");

  // Apply the new background with a short delay to ensure it updates
  setTimeout(() => {
    html.style.backgroundImage = backgrounds[level] || "url('../images/background_forest.gif')"
  }, 50);
}

function nextMap() {
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
}
