// Set the object of the game
export const gameInfos = {
  pause: false,
  level: 6,
  fps: 60,
  width: 600,
  height: 600,
  width_tiles: 11,
  height_tiles: 11,
}

// Getting the game container
const gameContainer = document.querySelector('.game-container');

gameContainer.style.width = `${gameInfos.width}px`;
gameContainer.style.height = `${gameInfos.height}px`;
