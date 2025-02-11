import { gameInfos } from "../constants/game.js";
import { handleKeyDown, handleKeyUp, keys } from "./player_inputs.js";
import { startTimer, stopTimer } from "./ui_scoring.js";
import { pauseAllExplosions, resumeAllExplosions } from '../entities/bomb.js'

let isPaused = false;

// Fonction pour basculer entre l'affichage et le masquage du menu de pause
function togglePause() {
  const pauseMenu = document.getElementById("pause-container");

  if (!pauseMenu) {
    console.error("Le menu de pause n'a pas été trouvé dans le DOM.");
    return;
  }

  // Afficher ou masquer le menu de pause
  if (!isPaused) {
    pauseMenu.classList.add("visible");
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    stopTimer();

    Object.keys(keys).forEach((key) => {
      keys[key] = false;
    });
  } else {
    pauseMenu.classList.remove("visible");
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    startTimer();
  }
  isPaused = !isPaused;

  const eventListeners = document.querySelectorAll(".game-container *");
  eventListeners.forEach((element) => {
    if (isPaused) {
      element.classList.add("paused");
    } else {
      element.classList.remove("paused");
    }
  });
}

// Gestionnaire de la touche "Escape" pour mettre en pause ou reprendre le jeu
function handlePause(event) {
  if (event.key === "Escape") {
    if (!isPaused) {
      // Freeze all explosions animations when pressing pause button
      pauseAllExplosions();
      togglePause();
    } else {
      // Resume the bomb animation while getting back to the game
      resumeAllExplosions();
      togglePause();

    }
  }
}

// Ajouter un écouteur d'événements dès le chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  // Dès que la page est complètement chargée, on commence à écouter "Escape"
  document.addEventListener("keydown", handlePause);
});

// Lier les actions du menu de pause
function bindPauseMenuActions() {
  document.getElementById("continue-button")?.addEventListener("click", () => {
    console.log("Resume the Game...");
    togglePause();
  });

  document.getElementById("restart-button")?.addEventListener("click", () => {
    console.log("Restart the game...");
    togglePause();
    //redémarrer le jeu
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

bindPauseMenuActions();
