import { handleKeyDown, handleKeyUp, keys } from "./player_inputs.js";
import { startTimer, stopTimer } from "./ui_scoring.js";
import { pauseAllExplosions, resumeAllExplosions } from "../entities/bomb.js";

export let isPaused = false;

function togglePause() {
  console.log("togglePause called");
  const pauseMenu = document.getElementById("pause-container");

  if (!pauseMenu) {
    console.error("Le menu de pause n'a pas été trouvé dans le DOM.");
    return;
  }

  isPaused = !isPaused;
  window.isPaused = isPaused;
  console.log("isPaused:", isPaused);

  if (isPaused) {
    console.log("Activating pause menu");
    pauseMenu.classList.add("visible");
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    stopTimer();
    pauseAllExplosions();

    Object.keys(keys).forEach((key) => {
      keys[key] = false;
    });
  } else {
    console.log("Deactivating pause menu");
    pauseMenu.classList.remove("visible");
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    startTimer();
    resumeAllExplosions();
  }
}

function handlePause(event) {
  console.log("Key pressed:", event.key);
  if (event.key === "Escape") {
    console.log("Escape key detected");
    togglePause();
  }
}

export function initializePauseSystem() {
  console.log("Initializing pause system");
  // Ajouter l'écouteur d'événements pour la touche Escape
  document.addEventListener("keydown", handlePause);
  console.log("Pause keydown listener added");

  // Initialiser les boutons du menu pause
  const continueButton = document.getElementById("continue-button");
  const restartButton = document.getElementById("restart-button");
  const exitButton = document.getElementById("exit-button");
  const retryButton = document.getElementById("retry-button");

  if (continueButton) {
    continueButton.addEventListener("click", () => {
      console.log("Continue button clicked");
      resumeAllExplosions();
      togglePause();
    });
  }

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      console.log("Restart button clicked");
      togglePause();
      window.location.reload();
    });
  }

  if (exitButton) {
    exitButton.addEventListener("click", () => {
      console.log("Exit button clicked");
      window.location.reload();
    });
  }

  if (retryButton) {
    retryButton.addEventListener("click", () => {
      console.log("Retry button clicked");
      window.location.reload();
    });
  }
}
