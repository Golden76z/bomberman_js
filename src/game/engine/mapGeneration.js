import { maps } from "../constants/levels.js";
import { gameInfos } from "../constants/game.js";
import { createWalls } from "../entities/colisionMap.js";

let currentMap = maps[gameInfos.level - 1];

const tileElements = [];

// Initial map rendering with references to each tile
function createMap(mapArray) {
  const gameMap = document.getElementById("gameMap");
  const player = gameMap.querySelector(".player");
  const info = gameMap.querySelector(".info");
  const coordinates = gameMap.querySelector(".coordinates");
  gameMap.innerHTML = "";
  tileElements.length = 0;

  mapArray.forEach((row, rowIndex) => {
    const tileRow = [];
    row.forEach((cell, colIndex) => {
      const tile = document.createElement("div");
      tile.classList.add("tile");

      switch (cell) {
        case 1:
          tile.classList.add("wall1");
          break;
        case 2:
          tile.classList.add("wall2");
          break;
        case 3:
          tile.classList.add("destructible");
          break;
        case 0:
        case 4:
          tile.classList.add("empty");
          break;
      }

      gameMap.appendChild(tile);
      tileRow.push(tile); // Store the reference
    });
    tileElements.push(tileRow);
  });

  if (player) gameMap.appendChild(player);
  if (info) gameMap.appendChild(info);
  if (coordinates) gameMap.appendChild(coordinates);
}

// Update a specific tile at (x, y)
export function updateTile(x, y, newValue) {
  const tile = tileElements[y][x];
  if (!tile) return;

  // Clear existing classes except 'tile'
  tile.className = "tile";

  // Apply new class based on the newValue in mapArray
  switch (newValue) {
    case 1:
      tile.classList.add("wall1");
      break;
    case 2:
      tile.classList.add("wall2");
      break;
    case 3:
      tile.classList.add("destructible");
      break;
    case 0:
      // case 4:
      tile.classList.add("empty");
      break;
  }
}

// Initialize the map depending on the game level
createMap(currentMap);
export let walls = createWalls(currentMap);
