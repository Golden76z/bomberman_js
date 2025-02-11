import { togglePause } from "./pause.js";

let score = 0;
let lives = 3;
let time = 0;
let timerInterval;

export function updateScore(pts) {
  score += pts;
  document.getElementById("score").innerText = "Score: " + score;
}

export function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  console.log("Timer started"); // Ajout du log pour vérifier si le timer démarre
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

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
});

export function stopTimer() {
  clearInterval(timerInterval);
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
    window.isPaused = true; // Mettre le jeu en pause quand game over
  } else {
    console.error("Error DOM => game-over-container");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
  updateScore(0);
  updateLives(); // Modifier pour juste mettre à jour l'affichage initial
});
