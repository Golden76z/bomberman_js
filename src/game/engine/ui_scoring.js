import { gameInfos } from "../constants/game.js";
import { playerInfos } from "../constants/player_infos.js";
import { showGameOver } from "./game-over.js";
import { checkLevel } from "./checkLevel.js";
import { maps } from "../constants/levels.js";

let timerInterval;
export let score = 0;
export let timeLeft = 0;
let isPaused = false;

export function initializeGameUI() {
  window.score = score;
  window.timeLeft = timeLeft;

  updateUI();
  startTimer();
}

// Function to update the score, timer and hp of player
function updateUI() {
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("lives").textContent = `HP: ${playerInfos.hearts}`;
  document.getElementById("timer").textContent = `Temps: ${formatTime(
    timeLeft
  )}`;
}

// Function to launch the timer when starting a game
export function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft++;
      window.timeLeft = timeLeft;
      document.getElementById("timer").textContent = `Temps: ${formatTime(
        timeLeft
      )}`;

      if (playerInfos.hearts <= 0) {
        console.log("Vies à 0 ! Game Over déclenché.");
        clearInterval(timerInterval);
        showGameOver();
      }
    }
  }, 1000);
}

// Function to freeze the timer
export function pauseTimer() {
  // console.log("Timer en pause");
  isPaused = true;
}

// Function to unfreeze the timer
export function resumeTimer() {
  // console.log("Reprise du timer");
  isPaused = false;
}

// Function to restart the timer
export function restartTimer() {
  clearInterval(timerInterval);
  timeLeft = 0;
  updateUI();
  startTimer();
}

// Function to be able to display timer with good format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export function updateScore(points) {
  score += points;

  window.score = score;
  updateUI();

  if (score >= gameInfos.score * gameInfos.level) {
    const currentMap = maps[gameInfos.level - 1];
    checkLevel(currentMap);
  }
}
