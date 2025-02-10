import { playerInfos } from "../constants/player_infos.js";

export class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.gameBoard = document.getElementById('gameMap');
    this.element = null;
    this.createExplosionEffect();
  }

  createExplosionEffect() {
    this.element = document.createElement('div');
    this.element.className = 'explosion';
    this.element.style.position = 'absolute';
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = '64px';
    this.element.style.height = '64px';

    this.gameBoard.appendChild(this.element);

    setTimeout(() => {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
        playerInfos.bomb = true
      }
    }, 5000);
  }
}
