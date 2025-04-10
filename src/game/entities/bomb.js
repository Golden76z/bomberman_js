import { playerInfos } from "../constants/player_infos.js";
import { gameInfos } from "../constants/game.js";
import { aiController } from "../engine/player_inputs.js";

const activeExplosions = new Set();
let tileWidth = gameInfos.width / gameInfos.width_tiles;
let tileHeight = gameInfos.height / gameInfos.height_tiles;

export class Explosion {
  constructor(x, y, owner) {
    this.x = x;
    this.y = y;
    this.owner = owner;
    this.gameBoard = document.getElementById("gameMap");
    this.element = null;
    this.startTime = null;
    this.duration = 2000;
    this.isPaused = false;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.animationFrameId = null;

    activeExplosions.add(this);
    this.createExplosionEffect();
  }

  // Function to create the visual effect and start the animation
  createExplosionEffect() {
    this.element = document.createElement("div");
    this.element.className = "explosion";
    this.element.style.position = "absolute";

    // Calculate which tile we're closest to using the same logic as tilemap
    let tileX = Math.floor(this.x % tileWidth);
    let tileY = Math.floor(this.y % tileHeight);

    if (tileX > tileWidth / 2) {
      this.tileX = Math.floor(this.x / tileWidth) + 1;
    } else {
      this.tileX = Math.floor(this.x / tileWidth);
    }

    if (tileY > tileHeight / 2) {
      this.tileY = Math.floor(this.y / tileHeight) + 1;
    } else {
      this.tileY = Math.floor(this.y / tileHeight);
    }

    // Convert tile coordinates back to pixels and center the explosion
    const pixelX = this.tileX * tileWidth;
    const pixelY = this.tileY * tileHeight;

    // Center the 64x64 explosion in the tile
    this.element.style.left = `${pixelX + (tileWidth - 64) / 2}px`;
    this.element.style.top = `${pixelY + (tileHeight - 64) / 2}px`;
    this.element.style.width = "64px";
    this.element.style.height = "64px";

    this.gameBoard.appendChild(this.element);
    this.startTime = performance.now();
    this.animate(this.startTime);
  }

  // Function to execute the animation depending on the time given
  animate(currentTime) {
    if (!this.startTime) this.startTime = currentTime;

    if (!this.isPaused) {
      const elapsedTime = currentTime - this.startTime - this.totalPausedTime;

      if (elapsedTime >= this.duration) {
        this.remove();
        return;
      }

      this.animationFrameId = requestAnimationFrame((timestamp) =>
        this.animate(timestamp)
      );
    }
  }

  pause() {
    if (!this.isPaused) {
      this.isPaused = true;
      this.pauseStartTime = performance.now();
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      // Pause CSS animations
      if (this.element) {
        this.element.style.animationPlayState = "paused";
      }
    }
  }

  resume() {
    if (this.isPaused) {
      const currentTime = performance.now();
      this.totalPausedTime += currentTime - this.pauseStartTime;
      this.isPaused = false;
      // Resume CSS animations
      if (this.element) {
        this.element.style.animationPlayState = "running";
      }
      this.animate(currentTime);
    }
  }

  // Function to remove the bomb div and remove it from the set aswell
  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);

      // Decrement bomb count for the correct owner
      if (this.owner === 'player') {
        playerInfos.bomb--;
      } else if (this.owner === 'ai') {
        for (let i = 0; i < aiController.length; i++) {
          aiController[i].aiInfos.bomb--
        }
      }

      activeExplosions.delete(this);
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Function to freeze all bombs animations both in js and css
export function pauseAllExplosions() {
  activeExplosions.forEach((explosion) => explosion.pause());
}

// Function to resume all bomb where they were left
export function resumeAllExplosions() {
  activeExplosions.forEach((explosion) => explosion.resume());
}

// Function that returns the Set containing all the bombs
export function getActiveExplosionsCount() {
  return activeExplosions.size;
}
