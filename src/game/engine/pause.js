import { pauseTimer, resumeTimer } from "./ui_scoring.js";
import { pauseAllExplosions, resumeAllExplosions } from "../entities/bomb.js";
import { gameInfos } from '../constants/game.js'
import { checkLevel } from "./checkLevel.js";
import { maps } from '../constants/levels.js'
import { transitionToNextLevel } from "./checkLevel.js";

document.addEventListener("keydown", (event) => {
  //console.log(`Touche pressée : ${event.key}`);
  if (event.key === "p" || event.key === "Escape") {
    if (gameInfos.pause) {
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

  gameInfos.pause = true;
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

  gameInfos.pause = false;
  window.isPaused = false;
  resumeTimer();
  resumeAllExplosions();

  window.dispatchEvent(new Event("resumeGame"));
}

function restartGame() {
  console.log("Redémarrage du jeu");
  window.isPaused = false;
  gameInfos.pause = false;
  // window.location.reload();
  gameInfos.restart = true

  // Remove the pause menu from the screen
  const pauseContainer = document.getElementById("pause-container");
  pauseContainer.classList.add("hidden");
  pauseContainer.classList.remove("visible");

  // Resets the map
  checkLevel(maps[gameInfos.level - 1])
}

function exitToMenu() {
  transitionToNextLevel()

  setTimeout(() => {
    console.log("Retour au menu principal");
    document.getElementById("game-wrapper").classList.add("hidden");
    document.getElementById("menu-screen").classList.remove("hidden");
    window.location.reload();
  }, 700)
}
