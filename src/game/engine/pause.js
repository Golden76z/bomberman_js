import { handleKeyDown, handleKeyUp, keys } from "./player_inputs.js";
import { startTimer, stopTimer } from "./ui_scoring.js";
import { pauseAllExplosions, resumeAllExplosions } from "../entities/bomb.js";

// Exporter isPaused pour l'utiliser dans d'autres modules
export let isPaused = false;

function togglePause() {
  const pauseMenu = document.getElementById("pause-container");

  if (!pauseMenu) {
    console.error("Le menu de pause n'a pas été trouvé dans le DOM.");
    return;
  }

  // Définir d'abord l'état de pause
  isPaused = !isPaused;
  window.isPaused = isPaused;

  if (isPaused) {
    pauseMenu.classList.add("visible");
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    stopTimer();
    pauseAllExplosions();

    // Réinitialiser les touches à l'état "non pressées"
    Object.keys(keys).forEach((key) => {
      keys[key] = false;
    });
  } else {
    pauseMenu.classList.remove("visible");
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    startTimer();
    resumeAllExplosions();
  }

  // Appliquer la classe "paused" à tous les éléments de la classe .game-container
  const eventListeners = document.querySelectorAll(".game-container *");
  eventListeners.forEach((element) => {
    if (isPaused) {
      element.classList.add("paused");
    } else {
      element.classList.remove("paused");
    }
  });
}

function handlePause(event) {
  console.log(event.key);
  if (event.key === "Escape") {
    togglePause();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", handlePause);
  bindPauseMenuActions();
});

function bindPauseMenuActions() {
  document.getElementById("continue-button")?.addEventListener("click", () => {
    console.log("Resume the Game...");
    resumeAllExplosions();
    togglePause();
  });

  document.getElementById("restart-button")?.addEventListener("click", () => {
    console.log("Restart the game...");
    togglePause();
    window.location.reload();
  });

  document.getElementById("exit-button")?.addEventListener("click", () => {
    console.log("Exit the game(reload page)");
    window.location.reload();
  });

  document.getElementById("retry-button")?.addEventListener("click", () => {
    console.log("restart the game...");
    window.location.reload();
  });
}

export { togglePause };
