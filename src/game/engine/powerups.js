import { playerInfos } from "../constants/player_infos"

//export let  canDrop = Math.floor(Math.random()*5)

export function generateDropChance(){
  return Math.floor(Math.random()*5)
}

export function generateRandomPowerUp(){
  return Math.floor(Math.random()*powerUps.length())
}

export function applyPowerUp(){
  const powerUpKeys = Object.keys(powerUps)
  const randomPowerUp = powerUps[generateRandomPowerUp()]
  if (randomPowerUp === "bombRadius"){
    playerInfos.bombLength = playerInfos.bombLength + powerUps.bombRadius
  }
  if (randomPowerUp === "bombAdd"){
    playerInfos.bomb = playerInfos.bomb + powerUps.bombAdd
  }
  if (randomPowerUp === "maxBombAdd"){
    playerInfos.maxBomb = playerInfos.maxBomb + powerUps.maxBombAdd
  }
  if (randomPowerUp === "lifeAdd"){
    playerInfos.hearts = playerInfos.hearts + powerUps.lifeAdd
  }
}

export function canSpawnPowerUp() {
  if (generateDropChance()=== 4){
    return true
  }else {
    return false
  }
}

export function spawnPowerup(){
  //dropBomb()
  if (canSpawnPowerUp()){
    powerUp = generateRandomPowerUp()
    const powerup = document.createElement('div')
    powerup.classList.add('powerup')
    powerup.style.top = `${Math.floor(Math.random()*window.innerHeight)}px`
    powerup.style.left = `${Math.floor(Math.random()*window.innerWidth)}px`
    document.body.appendChild(powerup)
    setTimeout(() => {
      powerup.remove()
      }, 3000)
  }
}

export function dropBomb(){
  if (playerInfos.bomb == 1){
    canDrop = 4

  }
}

export function excludeBombDropsLogic(){
  let excludeKey = ""
  if (playerInfos.bomb === 3) {
    excludeKey = "bombAdd"
  }
  let newPowerUps = Object.keys(powerUps).reduce((acc,key)=>
    {
      if (key !== excludeKey){
        acc[key] = powerUps[key]
        }
    })
  return newPowerUps
}

export const powerUps = {
  bombRadius : 1,
  bombAdd : 1,
  maxBombAdd : 1,
  lifeAdd : 1,

}
