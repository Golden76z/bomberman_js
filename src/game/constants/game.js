// Set the object of the game
export const gameInfos = {
  pause: true,
  transition: false,
  restart: false,
  level: 1,
  fps: 60,
  tileSize: 55, // Fixed size for each tile
  width_tiles: 9,
  height_tiles: 9,
  wallStyles: {
    level1: {
      wall1: "../../images/tiles/grass1.png",
      wall2: "../../images/tiles/grass2.png",
      empty: "../../images/tiles/grass4.png",
      destructible: "../../images/tiles/grass3.png"
    },
    level2: {
      wall1: "../../images/tiles/Sprite-0001.png",
      wall2: "../../images/tiles/Sprite-0002.png",
      empty: "../../images/tiles/ground.png",
      destructible: "../../images/tiles/Sprite-0005.png"
    },
    level3: {
      wall1: "../../images/tiles/brick1.png",
      wall2: "../../images/tiles/brick2.png",
      empty: "../../images/tiles/brick4.png",
      destructible: "../../images/tiles/brick3.png"
    }
  }
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
export const gameContainerStyles = () => {
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

export function updateWallStyles() {
  // Create or get the style element
  let styleElement = document.getElementById('wall-styles');
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'wall-styles';
    document.head.appendChild(styleElement);
  }

  // Get current level styles
  const currentStyles = gameInfos.wallStyles[`level${gameInfos.level}`];

  // Update the CSS
  styleElement.textContent = `
    .wall1 {
      background-image: url("${currentStyles.wall1}");
    }
    .wall2 {
      background-image: url("${currentStyles.wall2}");
    }
    .empty {
      background-image: url("${currentStyles.empty}");
    }
    .destructible {
      background-image: url("${currentStyles.destructible}");
    }
  `;
}

updateWallStyles();

// Applying the dynamic styles
const styles = gameContainerStyles();
for (const [key, value] of Object.entries(styles)) {
  gameContainer.style[key] = value;
}
