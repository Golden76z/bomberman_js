import { showGameOver } from "./game-over.js";

let timerInterval;
let score = 0;
let lives = 3;
let timeLeft = 0;
let isPaused = false;

export function initializeGameUI() {
  updateUI();
  startTimer();
}

function updateUI() {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("lives").textContent = `Vies: ${lives}`;
  document.getElementById("timer").textContent = `Temps: ${formatTime(
    timeLeft
  )}`;
}

export function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!isPaused) {
      // 🚀 Bloque l'incrémentation pendant la pause
      timeLeft++;
      document.getElementById("timer").textContent = `Temps: ${formatTime(
        timeLeft
      )}`;

      if (lives <= 0) {
        console.log("Vies à 0 ! Game Over déclenché.");
        clearInterval(timerInterval);
        showGameOver();
      }
    }
  }, 1000);
}

export function pauseTimer() {
  console.log("Timer en pause");
  isPaused = true; // Ajout pour bien bloquer l'incrémentation
}

export function resumeTimer() {
  console.log("Reprise du timer");
  isPaused = false;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}
