import { gameInfos } from '../constants/game.js';
import { placeBomb } from "../engine/handleExplosion.js";
import { handleExplosionEffect } from '../entities/colisionMap.js';
import { activeBombPositions } from '../engine/handleExplosion.js';

const aiRegistry = new Set();

export class AIController {
  constructor(x, y, hp, walls, id) {
    this.id = id || `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.blockedDirections = new Set();
    this.walls = walls;
    this.positionX = x;
    this.positionY = y;
    this.disabled = false;
    this.aiInfos = {
      width: 40,
      height: 40,
      frameWidth: 50,
      frameHeight: 50,
      moveSpeed: 0.15,
      health: hp,
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
    this.escapeSpeed = this.aiInfos.moveSpeed * 1;

    // Initialize keys object
    this.keys = {
      ArrowRight: false,
      ArrowLeft: false,
      ArrowUp: false,
      ArrowDown: false,
      z: false,
      q: false,
      s: false,
      d: false,
    };

    this.injectStyles();
    this.createAIPlayer();
    this.position = this.getInitialPosition();
    this.direction = this.getRandomDirection();
    this.directionChangeInterval = 1000;
    this.lastDirectionChange = Date.now();
    this.bombInterval = 1000;
    this.lastBombPlaced = Date.now();
    this.updateAIPosition();

    // Register this AI instance
    aiRegistry.add(this);
  }

  // Disable this AI
  disable() {
    this.disabled = true;
    if (this.aiElement) {
      this.aiElement.style.display = 'none';
    }
  }

  // Enable this AI
  enable() {
    this.disabled = false;
    if (this.aiElement) {
      this.aiElement.style.display = '';
    }
  }

  // Remove this AI instance from the game
  destroy() {
    if (this.aiElement) {
      this.aiElement.remove();
    }
    aiRegistry.delete(this);
  }

  // Static methods to manage multiple AIs
  static getAllAIs() {
    return Array.from(aiRegistry);
  }

  static areAllAIsDisabled() {
    return Array.from(aiRegistry).every(ai => ai.disabled);
  }

  static getEnabledAICount() {
    return Array.from(aiRegistry).filter(ai => !ai.disabled).length;
  }

  static getDisabledAICount() {
    return Array.from(aiRegistry).filter(ai => ai.disabled).length;
  }

  injectStyles() {
    const styleId = 'ai-player-styles';
    if (!document.getElementById(styleId)) {
      const styleSheet = document.createElement('style');
      styleSheet.id = styleId;
      styleSheet.textContent = `
        .ai-player {
          width: ${this.aiInfos.frameWidth}px;
          height: ${this.aiInfos.frameHeight}px;
          position: absolute;
          background-image: url(${this.aiInfos.spriteSheet});
          background-repeat: no-repeat;
          background-size: 600px 100px;
          image-rendering: pixelated;
          transform-origin: center;
          margin-left: -${this.aiInfos.spriteOffsetX}px;
          margin-top: -${this.aiInfos.spriteOffsetY}px;
        }

        .ai-player.character-0 {
          background-position-y: 0px;
        }

        .ai-player.character-1 {
          background-position-y: -50px;
        }

        .ai-player.facing-down {
          animation: aiWalkDown ${this.aiInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.facing-left {
          animation: aiWalkLeft ${this.aiInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.facing-right {
          animation: aiWalkRight ${this.aiInfos.animationDuration}s steps(3) infinite;
        }

        .ai-player.facing-up {
          animation: aiWalkUp ${this.aiInfos.animationDuration}s steps(3) infinite;
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
    const existingAI = document.querySelector(`.ai-player-${this.id}`);
    if (existingAI) {
      existingAI.remove();
    }

    // Create new AI player element
    this.aiElement = document.createElement('div');
    this.aiElement.className = `ai-player ai-player-${this.id}`; // Add unique class

    // Copy styles
    this.aiElement.style.width = `${this.aiInfos.frameWidth}px`;
    this.aiElement.style.height = `${this.aiInfos.frameHeight}px`;
    this.aiElement.style.position = 'absolute';
    this.aiElement.style.backgroundImage = 'url(../images/player.png)';
    this.aiElement.style.backgroundRepeat = 'no-repeat';
    this.aiElement.style.backgroundSize = '600px 100px';
    this.aiElement.style.imageRendering = 'pixelated';
    this.aiElement.style.transformOrigin = 'center';
    this.aiElement.style.marginLeft = `-${this.aiInfos.spriteOffsetX}px`;
    this.aiElement.style.marginTop = `-${this.aiInfos.spriteOffsetY}px`;

    // Add to game container
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
      gameContainer.appendChild(this.aiElement);
    }

    // Set initial character appearance
    this.aiElement.classList.add(`character-${this.aiInfos.characterIndex}`);
    this.aiElement.classList.add('idle-down');
  }

  updateAIPosition() {
    if (this.disabled || !this.position || !this.aiElement) return;
    if (this.aiElement) {
      this.aiElement.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    }
  }

  updateAIAnimation() {
    if (this.disabled || !this.aiElement) return;
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
    this.aiElement.classList.add(`character-${this.aiInfos.characterIndex}`);

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
    const maxX = (gameInfos.width_tiles * gameInfos.tileSize) - this.positionX;
    const maxY = (gameInfos.height_tiles * gameInfos.tileSize) - this.positionY;

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
    const boundaryX = (gameInfos.width_tiles * gameInfos.tileSize) - this.aiInfos.width;
    const boundaryY = (gameInfos.height_tiles * gameInfos.tileSize) - this.aiInfos.height;

    // Check boundaries
    if (newX < 0 || newX > boundaryX || newY < 0 || newY > boundaryY) {
      return false;
    }

    // Check wall collisions using the Wall class's checkCollision method
    return !this.walls.some(wall => wall.checkCollision(
      newX,
      newY,
      this.aiInfos.width,
      this.aiInfos.height
    ));
  }

  isInExplosionRange(bombX, bombY) {
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    // Check if AI is in cross pattern from bomb, accounting for bomb length
    for (let i = 0; i <= this.aiInfos.bombLength; i++) {
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

  checkForDanger() {
    if (this.disabled) return false;

    // Get AI's current tile position
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    if (activeBombPositions.size === 0) {
      this.inDanger = false;
      return false;
    }

    let mostDangerousBomb = null;
    let shortestDistance = Infinity;

    // Check all active bombs, including the one just placed
    for (const [key, bombData] of activeBombPositions.entries()) {
      if (this.isInExplosionRange(bombData.mapX, bombData.mapY)) {
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

  isSafeToPlaceBomb() {
    if (this.disabled) return false;

    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    // Check more thoroughly for escape routes
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    // Count available escape routes
    let availableEscapeRoutes = 0;
    for (const dir of directions) {
      const escapeX = (aiTileX + dir.dx) * gameInfos.tileSize;
      const escapeY = (aiTileY + dir.dy) * gameInfos.tileSize;

      // Check if the escape route is clear
      if (this.canMove(escapeX, escapeY)) {
        // Check if there's a secondary escape route from this position
        for (const secondDir of directions) {
          if (secondDir.dx === -dir.dx && secondDir.dy === -dir.dy) continue; // Don't go back

          const secondaryX = escapeX + (secondDir.dx * gameInfos.tileSize);
          const secondaryY = escapeY + (secondDir.dy * gameInfos.tileSize);

          if (this.canMove(secondaryX, secondaryY)) {
            availableEscapeRoutes++;
            break;
          }
        }
      }
    }

    // Only consider it safe if there are at least 2 escape routes with secondary paths
    return availableEscapeRoutes >= 2;
  }

  calculateEscapeRoute(bombX, bombY) {
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

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

      const newX = newTileX * gameInfos.tileSize;
      const newY = newTileY * gameInfos.tileSize;

      // Skip if we can't move there
      if (!this.canMove(newX, newY)) continue;

      // Skip if this position would still be in explosion range
      if (this.isInExplosionRange(bombX, bombY)) continue;

      let safetyScore = 0;

      // Heavily weight positions that are completely out of bomb range
      safetyScore += 30;

      // Weight distance from bomb (prefer further positions)
      const distanceFromBomb = Math.abs(newTileX - bombX) + Math.abs(newTileY - bombY);
      safetyScore += distanceFromBomb * 5;

      // Check for secondary escape routes from this position
      let secondaryRoutes = 0;
      for (const escapeDir of directions) {
        // Don't count going back towards the bomb
        if (escapeDir.dx === -dir.dx && escapeDir.dy === -dir.dy) continue;

        const escapeTileX = newTileX + escapeDir.dx;
        const escapeTileY = newTileY + escapeDir.dy;
        const escapeX = escapeTileX * gameInfos.tileSize;
        const escapeY = escapeTileY * gameInfos.tileSize;

        if (this.canMove(escapeX, escapeY) &&
          !this.isInExplosionRange(bombX, bombY)) {
          secondaryRoutes++;
        }
      }
      safetyScore += secondaryRoutes * 10;

      if (safetyScore > maxSafetyScore) {
        maxSafetyScore = safetyScore;
        bestDirection = dir.direction;
      }
    }

    // If no safe direction is found, prioritize any possible movement away from the bomb
    if (!bestDirection) {
      for (const dir of directions) {
        const newX = (aiTileX + dir.dx) * gameInfos.tileSize;
        const newY = (aiTileY + dir.dy) * gameInfos.tileSize;

        if (this.canMove(newX, newY)) {
          return dir.direction;
        }
      }
    }

    return bestDirection || this.getRandomDirection();
  }

  shouldPlaceBomb() {
    if (this.disabled) return false;
    const currentTime = Date.now();

    // Don't place bomb if already in danger
    if (this.inDanger) return false;

    // Don't place bomb if cooldown hasn't expired
    if (currentTime - this.lastBombPlaced <= this.bombInterval) return false;

    // Don't place bomb if at max bombs
    if (this.aiInfos.bomb >= this.aiInfos.maxBomb) return false;

    // Only place bomb if it's safe to do so
    if (!this.isSafeToPlaceBomb()) return false;

    // Calculate escape route before deciding to place bomb
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    const escapeDir = this.calculateEscapeRoute(aiTileX, aiTileY);

    // Only place bomb if we have a valid escape route
    if (escapeDir) {
      this.escapeDirection = escapeDir;
      this.lastBombPlaced = currentTime;
      this.inDanger = true;
      return true;
    }

    return false;
  }

  simulateKeyPress(deltaTime) {
    if (this.disabled || !this.position) {
      return this.keys;
    }

    // Reset all keys to false
    Object.keys(this.keys).forEach(key => this.keys[key] = false);

    // Check for danger
    const isInDanger = this.checkForDanger();

    // Use escape speed when in danger, normal speed otherwise
    const moveAmount = (this.inDanger ? this.escapeSpeed : this.aiInfos.moveSpeed) * deltaTime;
    let newX = this.position.x;
    let newY = this.position.y;

    // If in danger, immediately switch to escape behavior
    if (isInDanger) {
      // Cancel the current direction and use escape direction
      this.direction = this.escapeDirection;
      this.lastDirectionChange = Date.now(); // Reset direction change timer
    }

    // Calculate new position based on current direction
    switch (this.direction) {
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
        this.blockedDirections.add(this.direction);
        this.direction = this.getRandomDirection();
        this.escapeDirection = this.direction;
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
      switch (this.direction) {
        case 'ArrowRight':
          this.keys.ArrowRight = true;
          this.keys.d = true;
          break;
        case 'ArrowLeft':
          this.keys.ArrowLeft = true;
          this.keys.q = true;
          break;
        case 'ArrowUp':
          this.keys.ArrowUp = true;
          this.keys.z = true;
          break;
        case 'ArrowDown':
          this.keys.ArrowDown = true;
          this.keys.s = true;
          break;
      }
    }

    // Only change random direction if not in danger
    if (!this.inDanger && Date.now() - this.lastDirectionChange > this.directionChangeInterval) {
      this.direction = this.getRandomDirection();
      this.lastDirectionChange = Date.now();
      this.blockedDirections.clear();
    }

    return this.keys;
  }

  update(deltaTime) {
    if (this.disabled || !this.position || !this.aiElement) return;
    if (gameInfos.pause) return;

    const keys = this.simulateKeyPress(deltaTime);

    // Update position and animation
    this.updateAIPosition();
    this.updateAIAnimation();

    // Store AI controller reference for powerup system
    window.aiController = this;

    if (this.shouldPlaceBomb()) {
      const x = this.position.x - this.aiInfos.width / 3;
      const y = this.position.y - this.aiInfos.height / 3;

      placeBomb(x, y, "ai");
      handleExplosionEffect(x, y);
      this.aiInfos.bomb++;

      // Force immediate movement away from the bomb
      this.inDanger = true;
      this.direction = this.escapeDirection;
      this.lastDirectionChange = Date.now();
    }

    return {
      keys,
      position: this.position,
      characterIndex: this.aiInfos.characterIndex
    };
  }
}
