// Set the object of the game
export const gameInfos = {
  pause: false,
  level: 1,
  fps: 60,
  tileSize: 54.5, // Fixed size for each tile
  width_tiles: 9,
  height_tiles: 9,
};

export function updateGameLevel() {
  if (gameInfos.level == 1) {
    gameInfos.width_tiles = 9
    gameInfos.height_tiles = 9
  } else if (gameInfos.level == 2) {
    gameInfos.width_tiles = 11
    gameInfos.height_tiles = 11
  } else {
    gameInfos.width_tiles = 15
    gameInfos.height_tiles = 11
  }
  // Update width and height based on tile count and fixed tile size
  gameInfos.width = gameInfos.width_tiles * gameInfos.tileSize;
  gameInfos.height = gameInfos.height_tiles * gameInfos.tileSize;
}
updateGameLevel()

// Getting the game container
const gameContainer = document.querySelector(".game-container");

// Setting the style depending on the gameInfos object constant
const gameContainerStyles = () => {
  return {
    width: `${gameInfos.width}px`,
    height: `${gameInfos.height}px`,
    position: "relative",
    background: "#f0f0f0",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: `repeat(${gameInfos.width_tiles}, ${gameInfos.tileSize}px)`,
    gridTemplateRows: `repeat(${gameInfos.height_tiles}, ${gameInfos.tileSize}px)`,
  };
};

// Applying the dynamic styles
const styles = gameContainerStyles();
for (const [key, value] of Object.entries(styles)) {
  gameContainer.style[key] = value;
}
