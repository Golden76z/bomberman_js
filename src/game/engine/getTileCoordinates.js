import { gameInfos } from '../constants/game.js'

// Function to get tiles coordinates depending on the css coordinates
export function getTilesCoordinates(x, y) {
  let currentPosX = Math.floor(
    x % Math.floor(gameInfos.width / gameInfos.width_tiles)
  );
  let currentPosY = Math.floor(
    y % Math.floor(gameInfos.height / gameInfos.height_tiles)
  );

  if (currentPosX > gameInfos.width / gameInfos.width_tiles / 2) {
    currentPosX =
      Math.floor(x / Math.floor(gameInfos.width / gameInfos.width_tiles)) + 1;
  } else {
    currentPosX = Math.floor(
      x / Math.floor(gameInfos.width / gameInfos.width_tiles)
    );
  }

  if (currentPosY > gameInfos.height / gameInfos.height_tiles / 2) {
    currentPosY =
      Math.floor(y / Math.floor(gameInfos.height / gameInfos.height_tiles)) + 1;
  } else {
    currentPosY = Math.floor(
      y / Math.floor(gameInfos.height / gameInfos.height_tiles)
    );
  }

  return [currentPosX, currentPosY]
}
