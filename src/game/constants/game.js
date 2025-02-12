// Set the object of the game
export const gameInfos = {
  pause: false,
  level: 5,
  fps: 60,
  width: 600,
  height: 600,
  width_tiles: 11,
  height_tiles: 11,
}

// Getting the game container
const gameContainer = document.querySelector('.game-container');

// Setting the style depending on the gameInfos object constant
const gameContainerStyles = () => {
  return {
    width: `${gameInfos.width}px`,
    height: `${gameInfos.height}px`,
    position: 'relative',
    background: '#f0f0f0',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: `repeat(${gameInfos.width_tiles}, 1fr)`,
    gridTemplateRows: `repeat(${gameInfos.height_tiles}, 1fr)`
  };
};

// Applying the dynamic styles
const styles = gameContainerStyles();
for (const [key, value] of Object.entries(styles)) {
  gameContainer.style[key] = value;
}
