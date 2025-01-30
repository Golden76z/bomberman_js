export const gameContainer = document.getElementById("game")
export function renderMap(map) {
  gameContainer.innerHTML="";
  map.forEach(row => {
    row.forEach(tile=>{
      const div = document.createElement("div")
      div.classList.add("tile")
      div.style.backgroundImage = `url(${images[tile]})`
      gameContainer.appendChild(div)
    }
  )
});
}
