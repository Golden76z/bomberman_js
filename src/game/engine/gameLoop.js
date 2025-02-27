import { gameInfos } from "../constants/game.js";

export class GameLoop {
  constructor(fps = 60) {
    this.fps = fps;
    this.frameInterval = 1000 / fps;
    this.lastFrameTime = 0;
    this.running = false;
    this.accumulator = 0;

    // Animation stats
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.currentFps = 0;
  }

  start(updateFn) {
    this.running = true;
    this.lastFrameTime = performance.now();

    const animate = (currentTime) => {
      if (!this.running) return;
      if (window.isPaused) {
        requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - this.lastFrameTime;
      this.accumulator += deltaTime;

      // FPS counter check every second
      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;
        document.getElementById("fps-counter").textContent = `FPS: ${this.currentFps}`;
      }

      // Update game state for every frame
      while (this.accumulator >= this.frameInterval) {
        updateFn(this.frameInterval);
        this.accumulator -= this.frameInterval;
        this.frameCount++;
      }

      this.lastFrameTime = currentTime;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  stop() {
    this.running = false;
  }

  setFPS(newFPS) {
    this.fps = newFPS;
    this.frameInterval = 1000 / newFPS;
  }
}

// Create a gameLoop when the fps limiter given
export const gameLoop = new GameLoop(gameInfos.fps);
