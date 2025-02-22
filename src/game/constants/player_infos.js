// player_infos.js
export const playerInfos = {
  // Player hitbox
  width: 40,
  height: 40,
  // Player visual
  frameWidth: 50,
  frameHeight: 50,
  // PLayer starting position
  positionX: 60,
  positionY: 60,
  spriteSheet: "../images/player.png",
  animationDuration: 0.4,
  // Player style: 0 for blue, 1 for red
  characterIndex: 0,
  bomb: 0,
  // Player stats that can be affected by powerups
  maxBomb: 3,
  moveSpeed: 0.3,
  bombLength: 4,
  // Player life
  hearts: 3,
  extraHeart: 0,
  invulnerable: false,
};

// To center the hitbox in the middle of the character
playerInfos.spriteOffsetX = (playerInfos.frameWidth - playerInfos.width) / 1.8;
playerInfos.spriteOffsetY =
  (playerInfos.frameHeight - playerInfos.height) / 1.8;

// Player css style
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

// Adding the style to the css file
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
