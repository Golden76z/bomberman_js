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
      maxBomb: 3,
      bombLength: 4,
      characterIndex: 1,
      spriteSheet: '../images/player.png',
      spriteOffsetX: 5,
      spriteOffsetY: 5,
      animationDuration: 0.5
    };

    // Add new properties for danger detection
    this.inDanger = false;
    this.escapeDirection = null;
    this.dangerTimeout = null;

    // Existing constructor code remains the same...
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
    // Convert AI position to tile coordinates
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);
    const bombTileX = Math.floor(bombX / gameInfos.tileSize);
    const bombTileY = Math.floor(bombY / gameInfos.tileSize);

    // Check if AI is in the same row or column as the bomb
    const isInRow = aiTileY === bombTileY;
    const isInColumn = aiTileX === bombTileX;

    // Check if within bomb length range
    const inRowRange = Math.abs(aiTileX - bombTileX) <= this.playerInfos.bombLength;
    const inColumnRange = Math.abs(aiTileY - bombTileY) <= this.playerInfos.bombLength;

    return (isInRow && inRowRange) || (isInColumn && inColumnRange);
  }

  checkForDanger() {
    // Check all active bombs
    for (const [key, bombData] of activeBombPositions.entries()) {
      if (this.isInExplosionRange(bombData.mapX * gameInfos.tileSize, bombData.mapY * gameInfos.tileSize)) {
        this.inDanger = true;
        this.calculateEscapeRoute(bombData.mapX, bombData.mapY);
        return true;
      }
    }
    this.inDanger = false;
    return false;
  }

  calculateEscapeRoute(bombX, bombY) {
    const aiTileX = Math.floor(this.position.x / gameInfos.tileSize);
    const aiTileY = Math.floor(this.position.y / gameInfos.tileSize);

    // Calculate distances in each direction
    const distances = {
      'ArrowRight': { dx: 1, dy: 0, priority: 0 },
      'ArrowLeft': { dx: -1, dy: 0, priority: 0 },
      'ArrowUp': { dx: 0, dy: -1, priority: 0 },
      'ArrowDown': { dx: 0, dy: 1, priority: 0 }
    };

    // Check each direction
    for (const [direction, data] of Object.entries(distances)) {
      const newX = this.position.x + (data.dx * gameInfos.tileSize);
      const newY = this.position.y + (data.dy * gameInfos.tileSize);

      // Skip if direction is blocked
      if (!this.canMove(newX, newY)) {
        data.priority = -1;
        continue;
      }

      // Calculate how far this move takes us from the bomb
      const newTileX = Math.floor(newX / gameInfos.tileSize);
      const newTileY = Math.floor(newY / gameInfos.tileSize);

      const distanceFromBomb = Math.abs(newTileX - bombX) + Math.abs(newTileY - bombY);
      data.priority = distanceFromBomb;
    }

    // Choose the direction that takes us furthest from the bomb
    let bestDirection = null;
    let bestPriority = -1;

    for (const [direction, data] of Object.entries(distances)) {
      if (data.priority > bestPriority) {
        bestDirection = direction;
        bestPriority = data.priority;
      }
    }

    this.escapeDirection = bestDirection;
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

    // Check for danger and update movement accordingly
    this.checkForDanger();

    const currentTime = Date.now();
    const moveAmount = this.playerInfos.moveSpeed * deltaTime;
    let newX = this.position.x;
    let newY = this.position.y;

    // If in danger, use escape direction instead of normal direction
    const activeDirection = this.inDanger ? this.escapeDirection : this.direction;

    // Calculate new position based on active direction
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

    // Check if we can move in the current direction
    if (!this.canMove(newX, newY)) {
      if (this.inDanger) {
        // If in danger and current escape route is blocked, recalculate
        this.blockedDirections.add(this.escapeDirection);
        this.calculateEscapeRoute(
          Math.floor(this.position.x / gameInfos.tileSize),
          Math.floor(this.position.y / gameInfos.tileSize)
        );
      } else {
        this.blockedDirections.add(this.direction);
        this.direction = this.getRandomDirection();
      }
    } else {
      // Update position if movement is possible
      this.position.x = newX;
      this.position.y = newY;
      this.blockedDirections.clear();

      // Set the appropriate keys based on active direction
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

    // Only change random direction if not in danger and time has elapsed
    if (!this.inDanger && currentTime - this.lastDirectionChange > this.directionChangeInterval) {
      this.direction = this.getRandomDirection();
      this.lastDirectionChange = currentTime;
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
