import { playerInfos } from "../constants/player_infos"

//export let  canDrop = Math.floor(Math.random()*5)

export function generateDropChance(){
  // Generate a random number to serve as an index for the player's drop chance
  return Math.floor(Math.random()*5)
}

export function generateRandomPowerUp(){
  // Generate a random number to serve as an index for the powerUps array
  return Math.floor(Math.random()*powerUps.length())
}

export function applyPowerUp(obj){

  const powerUpKeys = Object.keys(obj)
  const randomPowerUp = obj[generateRandomPowerUp()]
  // handling bombRadius powerUp
  if (randomPowerUp === "bombRadius"){
    playerInfos.bombLength = playerInfos.bombLength + powerUps.bombRadius
  }
  // handling bombAdd powerUp adding a bomb to use
  if (randomPowerUp === "bombAdd"){
    playerInfos.bomb = playerInfos.bomb + powerUps.bombAdd
  }
  // handling maxBomb powerUp
  if (randomPowerUp === "maxBombAdd"){
    playerInfos.maxBomb = playerInfos.maxBomb + powerUps.maxBombAdd
  }
  // handling Life powerup
  if (randomPowerUp === "lifeAdd"){
    // If player is full HP add an extra heart to the bar
    if (playerInfos.extraHeart === 0 && playerInfos.hearts === 3){
      playerInfos.extraHeart = playerInfos.extraHeart + powerUps.lifeAdd
    }
    // If the player has missing hearts and isn't dead heal for 1 heart
    if (playerInfos.hearts < 3 && playerInfos.hearts > 0){
      playerInfos.hearts = playerInfos.hearts + powerUps.lifeAdd
    }
  }
  // handling speed powerup
  if (randomPowerUp === "speedBoost"){
    baseSpeed = playerInfos.moveSpeed // creating a copy of the player speed to reset it afterwards
    playerInfos.moveSpeed = playerInfos.moveSpeed*powerUps.speedBoost // apply speed powerUp
    // reset player speed after 10 secs
    setTimeout(()=>{
      playerInfos.moveSpeed = baseSpeed
    }, 10000)
  }
}

// function handling the possibility to spawn a powerUp or not
export function canSpawnPowerUp() {
  if (generateDropChance()=== 4){
    return true
  }else {
    return false
  }
}
// spawning the powerUp(s) in the game
export function spawnPowerup(obj){

  if (playerInfos.bomb === 3){
    // Quality of life change to not spawn a bomb refill if the player has full bombs
    obj = excludeBombDropsLogic() // excluding the addBomb powerUp from the powerUps pool
  }
  if (playerInfos.hearts === 3 && playerInfos.extraHeart ===1){
    // Quality of life change to not spawn a heart if the player has full hearts and has an extra heart
    obj = excludeHeartDropsLogic() // excluding the addLife powerUps from the powerUps pool
  }
// PowerUp spawn logic (NOT YET COMPLETED!!!)
  if (canSpawnPowerUp()){
    powerUpNumber = generateRandomPowerUp()
    const powerup = document.createElement('div')
    powerup.classList.add('powerup')
    powerup.style.top = `${Math.floor(Math.random()*window.innerHeight)}px`
    powerup.style.left = `${Math.floor(Math.random()*window.innerWidth)}px`
    document.body.appendChild(powerup)
    // remove the powerup if not picked up
    setTimeout(() => {
      powerup.remove()
      }, 3000)
  }
}
// function to exclude lifeAdd from the powerUps pool and returns a new powerUps object
export function excludeHeartsDropsLogic(){
  let excludeKey = "lifeAdd"

  let newPowerUps = Object.keys(powerUps).reduce((acc,key)=>
    {
      if (key !== excludeKey){
        acc[key] = powerUps[key]
        }
    })
  return newPowerUps
}
// function to exclude bombAdd from the powerUps pool and returns a new powerUps object
export function excludeBombDropsLogic(){
  let excludeKey = "bombAdd"

  let newPowerUps = Object.keys(powerUps).reduce((acc,key)=>
    {
      if (key !== excludeKey){
        acc[key] = powerUps[key]
        }
    })
  return newPowerUps
}

// PowerUps object listing all possible powerUps and their values
export const powerUps = {
  bombRadius : 1,
  bombAdd : 1,
  maxBombAdd : 1,
  lifeAdd : 1,
  invulnerabilite : true,
  speedBoost : 2,
}
