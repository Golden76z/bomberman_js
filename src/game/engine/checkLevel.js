import { gameInfos, updateGameLevel, updateWallStyles, gameContainerStyles } from "../constants/game.js"
import { playerInfos } from "../constants/player_infos.js"
import { createWalls } from "../entities/colisionMap.js"
import { createMap } from "./mapGeneration.js"
import { walls } from "./mapGeneration.js"
import { maps } from "../constants/levels.js"

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

// Function to update the map if the level is done
export function checkLevel() {
  let mapDone = checkWalls(walls)
  if (mapDone) {
    gameInfos.level++

    updateGameLevel()
    let currentMap = maps[gameInfos.level - 1]

    const gameContainer = document.querySelector(".game-container");
    // Applying the dynamic styles
    const styles = gameContainerStyles();
    for (const [key, value] of Object.entries(styles)) {
      gameContainer.style[key] = value;
    }
    updateWallStyles()

    // Create a new map and new objects walls
    createMap(currentMap);
    walls.length = 0
    walls.push(...createWalls(currentMap));
    console.log(walls);


    // Reset the player coordinates
    playerInfos.positionX = 60
    playerInfos.positionY = 60
  }
}
