import { gameInfos } from '../constants/game.js'

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

      // FPS counter
      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;
        // console.log(`Current FPS: ${this.currentFps}`);
      }

      if (this.accumulator >= this.frameInterval) {
        const updateCount = Math.floor(this.accumulator / this.frameInterval);

        for (let i = 0; i < updateCount; i++) {
          updateFn(this.frameInterval);
        }

        this.accumulator -= updateCount * this.frameInterval;
        this.lastFrameTime = currentTime;
        this.frameCount++;
      }

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
