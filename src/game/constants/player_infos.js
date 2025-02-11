// player_infos.js
export const playerInfos = {
  width: 40,          // Hitbox width
  height: 40,         // Hitbox height
  positionX: 60,
  positionY: 60,
  moveSpeed: 0.3,
  bomb: 0,
  maxBomb: 1,
  spriteSheet: '../images/player.png',
  frameWidth: 50,     // Sprite frame width
  frameHeight: 50,    // Sprite frame height
  spriteOffsetX: 5,   // (50 - 40) / 2 = 5px offset to center hitbox
  spriteOffsetY: 5,   // (50 - 40) / 2 = 5px offset to center hitbox
  animationDuration: 0.8,
  characterIndex: 0,  // 0 for first character, 1 for second character
};

const styles = `
.player {
  width: ${playerInfos.frameWidth}px;
  height: ${playerInfos.frameHeight}px;
  position: absolute;
  background-image: url(${playerInfos.spriteSheet});
  background-repeat: no-repeat;
  background-size: 600px 100px;  /* Updated to full sprite sheet size */
  image-rendering: pixelated;
  transform-origin: center;
  margin-left: -${playerInfos.spriteOffsetX}px;
  margin-top: -${playerInfos.spriteOffsetY}px;
}

.player.character-0 {
  background-position-y: 0px;
}

.player.character-1 {
  background-position-y: -50px;
}

.player.facing-down {
  animation: walkDown ${playerInfos.animationDuration}s steps(3) infinite;
}

.player.facing-left {
  animation: walkLeft ${playerInfos.animationDuration}s steps(3) infinite;
}

.player.facing-right {
  animation: walkRight ${playerInfos.animationDuration}s steps(3) infinite;
}

.player.facing-up {
  animation: walkUp ${playerInfos.animationDuration}s steps(3) infinite;
}

.player.idle-down {
  background-position-x: 0;
}

.player.idle-left {
  background-position-x: -150px;
}

.player.idle-right {
  background-position-x: -300px;
}

.player.idle-up {
  background-position-x: -450px;
}

@keyframes walkDown {
  from { background-position-x: 0; }
  to { background-position-x: -150px; }
}

@keyframes walkLeft {
  from { background-position-x: -150px; }
  to { background-position-x: -300px; }
}

@keyframes walkRight {
  from { background-position-x: -300px; }
  to { background-position-x: -450px; }
}

@keyframes walkUp {
  from { background-position-x: -450px; }
  to { background-position-x: -600px; }
}`;

// Add this to your JavaScript to inject the styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Getting the player div to apply style to it
const playerElement = document.querySelector('.player');

// Setting the style with playerInfos values
// playerElement.style.width = `${playerInfos.width}px`;
// playerElement.style.height = `${playerInfos.height}px`;
// playerElement.style.backgroundColor = playerInfos.color;
// playerElement.style.borderRadius = '4px'
playerElement.style.position = 'absolute'
