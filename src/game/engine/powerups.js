import { playerInfos } from "../constants/player_infos.js"

// Power-ups css animations
export const powerUpStyles = `
@keyframes float {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes pickup {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.powerup {
  position: absolute;
  pointer-events: none;
  transition: all 0.3s ease-out;
  opacity: 0;
  transform: scale(0);
}

.powerup.active {
  opacity: 1;
  transform: scale(1);
  animation: float 1s infinite ease-in-out;
}

.powerup.pickup {
  animation: pickup 0.3s ease-out forwards;
}
`;

export let positionXPowerUp
export let positionYPowerUp

// PowerUps object listing all possible powerUps and their values
export let powerUps = {
  bombRadius: 1,
  speedBoost: 2,
  maxBombAdd: 1,
  lifeAdd: 1,
  invulnerability: true,
  bombAdd: 1,
  positionX: positionXPowerUp,
  positionY: positionYPowerUp,
}

//export let  canDrop = Math.floor(Math.random()*5)

export function generateDropChance() {
  // Generate a random number to serve as an index for the player's drop chance
  return Math.floor(Math.random() * 5)
}

export function generateRandomPowerUp() {
  // Generate a random number to serve as an index for the powerUps array
  return Math.floor(Math.random() * 5)
}

// Updated function to handle both player and AI powerup application
export function applyPowerUp(actor, powerUpType) {
  const actorInfo = actor === 'player' ? playerInfos : actor.playerInfos;

  switch (powerUpType) {
    case 'bombRadius':
      actorInfo.bombLength += powerUps.bombRadius;
      break;

    case 'bombAdd':
      actorInfo.maxBomb += powerUps.maxBombAdd;
      break;

    case 'lifeAdd':
      if (actorInfo.extraHeart === 0 && actorInfo.hearts === 3) {
        actorInfo.extraHeart += powerUps.lifeAdd;
      } else if (actorInfo.hearts < 3 && actorInfo.hearts > 0) {
        actorInfo.hearts += powerUps.lifeAdd;
      }
      break;

    case 'speedBoost':
      const baseSpeed = actorInfo.moveSpeed;
      actorInfo.moveSpeed *= powerUps.speedBoost;
      setTimeout(() => {
        actorInfo.moveSpeed = baseSpeed;
      }, 10000);
      break;

    case 'invulnerability':
      actorInfo.invulnerable = true;
      setTimeout(() => {
        actorInfo.invulnerable = false;
      }, 7000);
      break;
  }
}

// function handling the possibility to spawn a powerUp or not
export function canSpawnPowerUp() {
  if (generateDropChance() === 4) {
    return true
  } else {
    return false
  }
}

// spawning the powerUp(s) in the game
export function spawnPowerup(obj) {

  if (playerInfos.bomb === 3) {
    // Quality of life change to not spawn a bomb refill if the player has full bombs
    obj = excludeBombDropsLogic() // excluding the addBomb powerUp from the powerUps pool
  }
  if (playerInfos.hearts === 3 && playerInfos.extraHeart === 1) {
    // Quality of life change to not spawn a heart if the player has full hearts and has an extra heart
    obj = excludeHeartDropsLogic() // excluding the addLife powerUps from the powerUps pool
  }
  // PowerUp spawn logic (NOT YET COMPLETED!!!)
  if (canSpawnPowerUp()) {
    powerUpNumber = generateRandomPowerUp()
    applyPowerUp(obj)
  }
}

// function to exclude lifeAdd from the powerUps pool and returns a new powerUps object
export function excludeHeartsDropsLogic() {
  let excludeKey = "lifeAdd"

  let newPowerUps = Object.keys(powerUps).reduce((acc, key) => {
    if (key !== excludeKey) {
      acc[key] = powerUps[key]
    }
  })
  return newPowerUps
}

// function to exclude bombAdd from the powerUps pool and returns a new powerUps object
export function excludeBombDropsLogic() {
  let excludeKey = "bombAdd"

  let newPowerUps = Object.keys(powerUps).reduce((acc, key) => {
    if (key !== excludeKey) {
      acc[key] = powerUps[key]
    }
  })
  return newPowerUps
}

export function canPickPowerUp() {
  if (playerInfos.positionX == powerUps.positionX && playerInfos.positionY == powerUps.positionY) {
    return true
  } else {
    return false
  }
}
