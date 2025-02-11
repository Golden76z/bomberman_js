import { playerInfos } from "../constants/player_infos.js";

const activeExplosions = new Set();

export class Explosion {
  constructor(x, y, map) {
    this.x = x;
    this.y = y;
    this.gameBoard = document.getElementById("gameMap");
    // console.log(this.map);
    // console.log(map);
    this.element = null;
    this.startTime = null;
    this.duration = 2000;
    this.isPaused = false;
    this.pauseStartTime = null;
    this.totalPausedTime = 0;
    this.animationFrameId = null;

    // Add this explosion to active explosions
    activeExplosions.add(this);

    this.createExplosionEffect();
  }

  // Function to create the visual effect and start the animation
  createExplosionEffect() {
    this.element = document.createElement("div");
    this.element.className = "explosion";
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
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
      playerInfos.bomb--;
      // Remove from the Set when time is done
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
