let score = 0;
let lives = 3;
let time = 0;
let timerInterval = null;
let isTimerRunning = false;

export function updateScore(pts) {
  score += pts;
  document.getElementById("score").innerText = "Score: " + score;
}

export function startTimer() {
  console.log("Timer function called"); // Debug log

  if (isTimerRunning) {
    console.log("Timer already running"); // Debug log
    return;
  }

  isTimerRunning = true;
  console.log("Starting timer"); // Debug log

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(function () {
    if (!window.isPaused) {
      time++;
      let minutes = Math.floor(time / 60);
      let seconds = time % 60;
      document.getElementById("timer").innerText =
        "Temps: " +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
    }
  }, 1000);
}

export function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    isTimerRunning = false;
  }
}

function updateLives() {
  document.getElementById("lives").innerText = "Vies: " + lives;
}

export function decreaseLives() {
  lives--;
  updateLives();
  if (lives <= 0) {
    showGameOver();
    stopTimer();
  }
}

function showGameOver() {
  const gameOver = document.getElementById("game-over-container");
  if (gameOver) {
    gameOver.classList.add("visible");
    window.isPaused = true;
  } else {
    console.error("Error DOM => game-over-container");
  }
}

// Fonction d'initialisation du jeu
export function initializeGameUI() {
  console.log("Initializing game UI"); // Debug log
  updateScore(0);
  updateLives();
}
