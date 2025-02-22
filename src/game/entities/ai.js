import { gameInfos } from '../constants/game.js';
import { placeBomb } from "../engine/handleExplosion.js";
import { handleExplosionEffect } from '../entities/colisionMap.js';
import { activeBombPositions } from '../engine/handleExplosion.js';

export class AIController {
  constructor(walls) {
    this.blockedDirections = new Set();
    this.walls = walls;
    this.playerInfos = {
      width: 40,
      height: 40,
      frameWidth: 50,
      frameHeight: 50,
      moveSpeed: 0.3,
      bomb: 0,
      maxBomb: 1,
      bombLength: 1,
      characterIndex: 1,
      spriteSheet: '../images/player.png',
      spriteOffsetX: 5,
      spriteOffsetY: 5,
      animationDuration: 0.5
    };

    // Add new properties for danger detection with increased escape speed
    this.inDanger = false;
    this.escapeDirection = null;
    this.dangerTimeout = null;
    this.escapeSpeed = this.playerInfos.moveSpeed * 1.5; // Faster escape speed

    this.injectStyles();
    this.createAIPlayer();
    this.position = this.getInitialPosition();
    this.direction = this.getRandomDirection();
    this.directionChangeInterval = 1000;
    this.lastDirectionChange = Date.now();
    this.bombInterval = 5000;
    this.lastBombPlaced = Date.now();
    this.updateAIPosition();
  }

  injectStyles() {
    const styleId = 'ai-player-styles';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.textContent = `
        .ai-player {
          width: ${this.playerInfos.frameWidth}px;
          height: ${this.playerInfos.frameHeight}px;
          position: absolute;
          background-image: url(${this.playerInfos.spriteSheet});
          background-repeat: no-repeat;
          background-size: 600px 100px;
          image-rendering: pixelated;
          transform-origin: center;
          margin-left: -${this.playerInfos.spriteOffsetX}px;
          margin-top: -${this.playerInfos.spriteOffsetY}px;
        }

        .ai-player.character-0 {
          background-position-y: 0px;
        }

        .ai-player.character-1 {
          background-position-y: -50px;
        }

        .ai-player.facing-down {
          animation: aiWalkDown ${this.playerInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.facing-left {
          animation: aiWalkLeft ${this.playerInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.facing-right {
          animation: aiWalkRight ${this.playerInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.facing-up {
          animation: aiWalkUp ${this.playerInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.idle-down {
          background-position-x: 0;
        }

        .ai-player.idle-left {
          background-position-x: -150px;
        }

        .ai-player.idle-right {
          background-position-x: -300px;
        }

        .ai-player.idle-up {
          background-position-x: -450px;
        }

        @keyframes aiWalkDown {
          from { background-position-x: 0; }
          to { background-position-x: -150px; }
        }

        @keyframes aiWalkLeft {
          from { background-position-x: -150px; }
          to { background-position-x: -300px; }
        }

        @keyframes aiWalkRight {
          from { background-position-x: -300px; }
          to { background-position-x: -450px; }
        }

        @keyframes aiWalkUp {
          from { background-position-x: -450px; }
          to { background-position-x: -600px; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }

  createAIPlayer() {
    // Remove existing AI player if it exists
    const existingAI = document.querySelector('.ai-player');
    if (existingAI) {
      existingAI.remove();
    }

    // Create new AI player element
    this.aiElement = document.createElement('div');
    this.aiElement.className = 'ai-player';

    // Add to game container
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.appendChild(this.aiElement);
    }

    // Set initial character appearance
    this.aiElement.classList.add(`character-${this.playerInfos.characterIndex}`);
    this.aiElement.classList.add('idle-down');
  }

  createAIPlayer() {
    // Remove existing AI player if it exists
    const existingAI = document.querySelector('.ai-player');
    if (existingAI) {
      existingAI.remove();
    }

    // Create new AI player element
    this.aiElement = document.createElement('div');
    this.aiElement.className = 'ai-player';

    // Copy styles from player class
    this.aiElement.style.width = `${this.playerInfos.frameWidth}px`;
    this.aiElement.style.height = `${this.playerInfos.frameHeight}px`;
    this.aiElement.style.position = 'absolute';
    this.aiElement.style.backgroundImage = 'url(../images/player.png)';
    this.aiElement.style.backgroundRepeat = 'no-repeat';
    this.aiElement.style.backgroundSize = '600px 100px';
    this.aiElement.style.imageRendering = 'pixelated';
    this.aiElement.style.transformOrigin = 'center';

    // Add to game container
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.appendChild(this.aiElement);
    }

    // Set initial character appearance
    this.aiElement.classList.add(`character-${this.playerInfos.characterIndex}`);
    this.aiElement.classList.add('idle-down');
  }

  updateAIPosition() {
    if (this.aiElement) {
      this.aiElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
  }

  updateAIAnimation() {
    if (!this.aiElement) return;

    this.aiElement.classList.remove(
      'facing-down',
      'facing-up',
      'facing-left',
      'facing-right',
      'idle-down',
      'idle-up',
      'idle-left',
      'idle-right'
    );

    // Keep character index
    this.aiElement.classList.add(`character-${this.playerInfos.characterIndex}`);

    // Add direction based animation
    switch (this.direction) {
      case 'ArrowRight':
        this.aiElement.classList.add('facing-right');
        break;
      case 'ArrowLeft':
        this.aiElement.classList.add('facing-left');
        break;
      case 'ArrowUp':
        this.aiElement.classList.add('facing-up');
        break;
      case 'ArrowDown':
        this.aiElement.classList.add('facing-down');
        break;
      default:
        this.aiElement.classList.add('idle-down');
    }
  }

  getInitialPosition() {
    const maxX = (gameInfos.width_tiles * gameInfos.tileSize) - 100;
    const maxY = (gameInfos.height_tiles * gameInfos.tileSize) - 100;

    return {
      x: maxX,
      y: maxY
    };
  }

  getRandomDirection() {
    const directions = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

    // Filter out blocked directions
    const availableDirections = directions.filter(dir => !this.blockedDirections.has(dir));

    if (availableDirections.length === 0) {
      // Reset blocked directions if all directions are blocked
      this.blockedDirections.clear();
      return directions[Math.floor(Math.random() * directions.length)];
    }

    return availableDirections[Math.floor(Math.random() * availableDirections.length)];
  }

  canMove(newX, newY) {
    const boundaryX = (gameInfos.width_tiles * gameInfos.tileSize) - this.playerInfos.width;
    const boundaryY = (gameInfos.height_tiles * gameInfos.tileSize) - this.playerInfos.height;

    // Check boundaries
    if (newX < 0 || newX > boundaryX || newY < 0 || newY > boundaryY) {
      return false;
    }

    // Check wall collisions using the Wall class's checkCollision method
    return !this.walls.some(wall => wall.checkCollision(
      newX,
      newY,
      this.playerInfos.width,
      this.playerInfos.height
    ));
  }

  isInExplosionRange(bombX, bombY) {
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    // Check if AI is in cross pattern from bomb, accounting for bomb length
    for (let i = 0; i <= this.playerInfos.bombLength; i++) {
      // Check horizontal line
      if (aiTileY === bombY && (
        aiTileX === bombX + i ||
        aiTileX === bombX - i
      )) {
        return true;
      }

      // Check vertical line
      if (aiTileX === bombX && (
        aiTileY === bombY + i ||
        aiTileY === bombY - i
      )) {
        return true;
      }
    }

    return false;
  }

  calculateEscapeRoute(bombX, bombY) {
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    // Check all four directions
    const directions = [
      { direction: 'ArrowRight', dx: 1, dy: 0 },
      { direction: 'ArrowLeft', dx: -1, dy: 0 },
      { direction: 'ArrowUp', dx: 0, dy: -1 },
      { direction: 'ArrowDown', dx: 0, dy: 1 }
    ];

    let bestDirection = null;
    let maxSafetyScore = -Infinity;

    for (const dir of directions) {
      const newTileX = aiTileX + dir.dx;
      const newTileY = aiTileY + dir.dy;

      // Calculate pixel position for collision check
      const newX = newTileX * gameInfos.tileSize;
      const newY = newTileY * gameInfos.tileSize;

      // Skip if movement is blocked
      if (!this.canMove(newX, newY)) continue;

      // Calculate safety score based on:
      // 1. Distance from bomb
      // 2. Whether the new position is out of explosion range
      // 3. Number of available escape routes from the new position
      let safetyScore = 0;

      // Distance from bomb (higher is better)
      const distanceFromBomb = Math.abs(newTileX - bombX) + Math.abs(newTileY - bombY);
      safetyScore += distanceFromBomb * 2;

      // Check if position is out of explosion range
      if (!this.isInExplosionRange(bombX, bombY)) {
        safetyScore += 10;
      }

      // Count available escape routes from new position
      let availableRoutes = 0;
      for (const escapeDir of directions) {
        const escapeTileX = newTileX + escapeDir.dx;
        const escapeTileY = newTileY + escapeDir.dy;
        const escapeX = escapeTileX * gameInfos.tileSize;
        const escapeY = escapeTileY * gameInfos.tileSize;

        if (this.canMove(escapeX, escapeY)) {
          availableRoutes++;
        }
      }
      safetyScore += availableRoutes * 2;

      // Update best direction if this is the safest option
      if (safetyScore > maxSafetyScore) {
        maxSafetyScore = safetyScore;
        bestDirection = dir.direction;
      }
    }

    return bestDirection || this.getRandomDirection();
  }

  checkForDanger() {
    if (activeBombPositions.size === 0) {
      this.inDanger = false;
      return false;
    }

    let mostDangerousBomb = null;
    let shortestDistance = Infinity;

    for (const [key, bombData] of activeBombPositions.entries()) {
      if (this.isInExplosionRange(bombData.mapX, bombData.mapY)) {
        const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
        const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

        const distance = Math.abs(aiTileX - bombData.mapX) + Math.abs(aiTileY - bombData.mapY);

        if (distance < shortestDistance) {
          shortestDistance = distance;
          mostDangerousBomb = bombData;
        }
      }
    }

    if (mostDangerousBomb) {
      this.inDanger = true;
      this.escapeDirection = this.calculateEscapeRoute(mostDangerousBomb.mapX, mostDangerousBomb.mapY);
      return true;
    }

    this.inDanger = false;
    return false;
  }

  simulateKeyPress(deltaTime) {
    const keys = {
      ArrowRight: false,
      ArrowLeft: false,
      ArrowUp: false,
      ArrowDown: false,
      z: false,
      q: false,
      s: false,
      d: false,
    };

    // Check for danger
    this.checkForDanger();

    // Use escape speed when in danger, normal speed otherwise
    const moveAmount = (this.inDanger ? this.escapeSpeed : this.playerInfos.moveSpeed) * deltaTime;
    let newX = this.position.x;
    let newY = this.position.y;

    // Determine active direction
    const activeDirection = this.inDanger ? this.escapeDirection : this.direction;

    // Calculate new position
    switch (activeDirection) {
      case 'ArrowRight':
        newX += moveAmount;
        break;
      case 'ArrowLeft':
        newX -= moveAmount;
        break;
      case 'ArrowUp':
        newY -= moveAmount;
        break;
      case 'ArrowDown':
        newY += moveAmount;
        break;
    }

    // Handle movement and collision
    if (!this.canMove(newX, newY)) {
      if (this.inDanger) {
        // If current escape route is blocked, try a different direction
        this.blockedDirections.add(this.escapeDirection);
        this.escapeDirection = this.getRandomDirection();
      } else {
        this.blockedDirections.add(this.direction);
        this.direction = this.getRandomDirection();
      }
    } else {
      // Update position and clear blocked directions
      this.position.x = newX;
      this.position.y = newY;
      this.blockedDirections.clear();

      // Set movement keys
      switch (activeDirection) {
        case 'ArrowRight':
          keys.ArrowRight = true;
          keys.d = true;
          break;
        case 'ArrowLeft':
          keys.ArrowLeft = true;
          keys.q = true;
          break;
        case 'ArrowUp':
          keys.ArrowUp = true;
          keys.z = true;
          break;
        case 'ArrowDown':
          keys.ArrowDown = true;
          keys.s = true;
          break;
      }
    }

    // Only change random direction if not in danger
    if (!this.inDanger && Date.now() - this.lastDirectionChange > this.directionChangeInterval) {
      this.direction = this.getRandomDirection();
      this.lastDirectionChange = Date.now();
      this.blockedDirections.clear();
    }

    return keys;
  }

  shouldPlaceBomb() {
    const currentTime = Date.now();
    if (currentTime - this.lastBombPlaced > this.bombInterval &&
      this.playerInfos.bomb < this.playerInfos.maxBomb) {
      this.lastBombPlaced = currentTime;
      return true;
    }
    return false;
  }

  update(deltaTime) {
    if (gameInfos.pause) return;

    const keys = this.simulateKeyPress(deltaTime);

    // Update position and animation
    this.updateAIPosition();
    this.updateAIAnimation();

    if (this.shouldPlaceBomb()) {
      const x = this.position.x - this.playerInfos.width / 3;
      const y = this.position.y - this.playerInfos.height / 3;

      placeBomb(x, y);
      handleExplosionEffect(x, y);
      this.playerInfos.bomb++;
    }

    return {
      keys,
      position: this.position,
      characterIndex: this.playerInfos.characterIndex
    };
  }
}
