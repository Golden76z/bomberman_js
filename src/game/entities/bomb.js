import { playerInfos } from "../constants/player_infos.js";

// Class to create bomb div elements that disapear after 2seconds
export class Explosion {
  constructor(x, y, map) {
    this.x = x;
    this.y = y;
    this.gameBoard = document.getElementById("gameMap");
    // console.log(this.map);
    // console.log(map);
    this.element = null;
    this.createExplosionEffect();
  }

  // Create the bomb div element
  createExplosionEffect() {
    this.element = document.createElement("div");
    this.element.className = "explosion";
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = "64px";
    this.element.style.height = "64px";

    this.gameBoard.appendChild(this.element);

    // Delete the bomb 2 seconds after placing it
    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
        // Set back the variable to true so the player can place a bomb again
        playerInfos.bomb--;
      }
    }, 2000);
  }
}
