// Animation constants
const SPRITE_FRAME_WIDTH = 64; // Original sprite frame width
const SPRITE_FRAME_HEIGHT = 64; // Original sprite frame height
const ANIMATION_DURATION = 550; // Total duration in ms
const FRAME_COUNT = 7;
const FRAME_DURATION = ANIMATION_DURATION / FRAME_COUNT;

// Class that creates the animation for the explosion
export class ExplosionAnimation {
  constructor(x, y, tileSize, direction = 'center', isEnd = false) {
    this.element = document.createElement('div');
    this.element.className = 'explosion-animation';
    this.element.style.position = 'absolute';
    this.element.style.width = `${tileSize}px`;
    this.element.style.height = `${tileSize}px`;
    this.element.style.left = `${x * tileSize}px`;
    this.element.style.top = `${y * tileSize}px`;
    this.element.style.backgroundImage = 'url("../images/bombs/explosion_effect.png")';

    // Scale background size proportionally
    const spriteSheetWidth = SPRITE_FRAME_WIDTH * 7; // 7 frames
    const spriteSheetHeight = SPRITE_FRAME_HEIGHT * 3; // 3 rows
    const scaledWidth = (spriteSheetWidth / SPRITE_FRAME_WIDTH) * tileSize;
    const scaledHeight = (spriteSheetHeight / SPRITE_FRAME_HEIGHT) * tileSize;
    this.element.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;

    this.element.style.zIndex = '5';
    this.tileSize = tileSize;

    // Set initial background position based on direction
    this.setDirectionStyles(direction, isEnd);

    // Start animation
    this.currentFrame = 0;
    this.startAnimation();
  }

  setDirectionStyles(direction, isEnd) {
    let rotationDeg = 0;
    const rowOffset = isEnd ? 2 : (direction === 'center' ? 0 : 1);
    const yOffset = (rowOffset * this.tileSize) + 'px';

    switch (direction) {
      case 'left':
        rotationDeg = 180;
        break;
      case 'up':
        rotationDeg = 270;
        break;
      case 'down':
        rotationDeg = 90;
        break;
      // 'right' and 'center' use default rotation (0)
    }

    if (rotationDeg !== 0) {
      this.element.style.transform = `rotate(${rotationDeg}deg)`;
      // Adjust position for rotated elements
      if (direction === 'up' || direction === 'down') {
        this.element.style.transformOrigin = 'center center';
      }
    }

    // Set initial background position
    this.element.style.backgroundPosition = `0px -${rowOffset * this.tileSize}px`;
  }

  startAnimation() {
    let frame = 0;
    const animate = () => {
      if (frame >= FRAME_COUNT) {
        this.element.remove();
        return;
      }

      this.element.style.backgroundPositionX = `-${frame * this.tileSize}px`;
      frame++;
      setTimeout(animate, FRAME_DURATION);
    };

    animate();
  }
}
