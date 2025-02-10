let score = 0;
let lives = 3;
let time = 0;
let timerInterval;

export function updateScore(pts) {
  score += pts;
  document.getElementById("score").innerText = "Score: " + score;
}

//Timer
export function startTimer() {
  timerInterval = setInterval(function () {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    document.getElementById("timer").innerText =
      "Temps: " +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
  }, 1000);
}

//Stop
export function stopTimer() {
  clearInterval(timerInterval);
}

//Live
function updateLives() {
  document.getElementById("lives").innerText = "Vies: " + lives;
}

export function decreaseLives() {
  lives--;
  updateLives();
  if (lives <= 0) {
    showGameOver();
    stopTimer();
    //ajouter redemarrage ou quitter le jeu
  }
}

function showGameOver() {
  const gameOver = document.getElementById("game-over-container");
  if (gameOver) {
    gameOver.classList.add("visible");
  } else {
    console.error("Error DOM => game-over-container");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
  updateScore(0);
  decreaseLives();
});
