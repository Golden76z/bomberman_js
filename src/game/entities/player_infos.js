// Player properties
export const playerInfos = {
  color: '#f34343',
  width: 50,
  height: 50,
  positionX: 0,
  positionY: 0,
  moveSpeed: 0.3
}

// Getting the player div to apply style to it
const playerElement = document.querySelector('.player');

// Setting the style with playerInfos values
playerElement.style.width = `${playerInfos.width}px`;
playerElement.style.height = `${playerInfos.height}px`;
playerElement.style.backgroundColor = playerInfos.color;
// playerElement.style.left = `${playerInfos.positionX}px`;
// playerElement.style.top = `${playerInfos.positionY}px`;
