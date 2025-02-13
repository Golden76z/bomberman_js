import { pauseTimer, resumeTimer } from "./ui_scoring.js";
import { pauseAllExplosions, resumeAllExplosions } from "../entities/bomb.js";

let isPaused = false;

document.addEventListener("keydown", (event) => {
  console.log(`Touche pressée : ${event.key}`);
  if (event.key === "p" || event.key === "Escape") {
    if (isPaused) {
      resumeGame();
    } else {
      showPauseMenu();
    }
  }
});

export function showPauseMenu() {
  console.log("showPauseMenu() appelé");
  const pauseContainer = document.getElementById("pause-container");

  if (!pauseContainer) {
    console.log("ERREUR : #pause-container introuvable !");
    return;
  }

  pauseContainer.classList.add("visible");
  pauseContainer.classList.remove("hidden");

  isPaused = true;
  window.isPaused = true;
  pauseTimer();
  pauseAllExplosions();

  document.getElementById("continue-button").onclick = resumeGame;
  document.getElementById("restart-button").onclick = restartGame;
  document.getElementById("exit-button").onclick = exitToMenu;
}

function resumeGame() {
  console.log("Reprise du jeu");
  const pauseContainer = document.getElementById("pause-container");
  pauseContainer.classList.remove("visible");
  pauseContainer.classList.add("hidden");

  isPaused = false;
  window.isPaused = false;
  resumeTimer();
  resumeAllExplosions();

  window.dispatchEvent(new Event("resumeGame"));
}

function restartGame() {
  console.log("Redémarrage du jeu");
  window.isPaused = false;
  window.location.reload();
}

function exitToMenu() {
  console.log("Retour au menu principal");
  document.getElementById("game-wrapper").classList.add("hidden");
  document.getElementById("menu-screen").classList.remove("hidden");
  window.location.reload();
}
