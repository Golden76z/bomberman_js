import { pauseTimer, score, lives, timeLeft } from "./ui_scoring.js";
import { pauseAllExplosions } from "../entities/bomb.js";

let isPaused = false;
export function showGameOver() {
  console.log("💀 Affichage de l'écran Game Over");
  const gameOverContainer = document.getElementById("game-over-container");

  if (!gameOverContainer) {
    console.error("ERREUR : #game-over-container introuvable !");
    return;
  }
  gameOverContainer.classList.add("visible");
  gameOverContainer.classList.remove("hidden");

  isPaused = true;
  window.isPaused = true;
  pauseTimer();
  pauseAllExplosions();

  document.getElementById("main-menu-button").onclick = exitToMenu;
}

export function restartGame() {
  score = 0;
  lives = 3;
  timeLeft = 0;
  window.location.reload();
}

export function exitToMenu() {
  document.getElementById("game-wrapper").classList.add("hidden");
  document.getElementById("menu-screen").classList.remove("hidden");
  window.location.reload();
}
