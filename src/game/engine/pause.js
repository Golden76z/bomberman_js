import { handleKeyDown, handleKeyUp } from "./player_inputs.js";

let isPaused = false;

// Fonction pour basculer entre l'affichage et le masquage du menu de pause
function togglePause() {
  const pauseMenu = document.getElementById("pause-container");

  if (!pauseMenu) {
    console.error("Le menu de pause n'a pas été trouvé dans le DOM.");
    return;
  }

  console.log("isPaused:", isPaused);

  // Afficher ou masquer le menu de pause
  if (isPaused) {
    pauseMenu.classList.add("visible");
  } else {
    pauseMenu.classList.remove("visible");
  }

  // Mettre à jour l'état global de pause
  window.isPaused = isPaused;

  const eventListeners = document.querySelectorAll(".game-container *");
  eventListeners.forEach((element) => {
    if (isPaused) {
      element.classList.add("paused");
    } else {
      element.classList.remove("paused");
    }
  });

  // Ajouter ou supprimer les événements de touche selon l'état de pause
  if (!isPaused) {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
  } else {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  }

  // Inverser l'état de la pause
  isPaused = !isPaused;
}

// Gestionnaire de la touche "Escape" pour mettre en pause ou reprendre le jeu
function handlePause(event) {
  if (event.key === "Escape") {
    console.log("Pause le jeu...");
    togglePause();
  }
}

// Lier l'événement pour la touche "Escape" (désactive si déjà en pause)
document.addEventListener("keydown", handlePause);

// Lier les actions du menu de pause
function bindPauseMenuActions() {
  document.getElementById("continue-button")?.addEventListener("click", () => {
    console.log("Continuer le jeu...");
    togglePause();
  });

  document.getElementById("restart-button")?.addEventListener("click", () => {
    console.log("Redémarrer le jeu...");
    togglePause();
    // Ajoute ici la logique pour redémarrer le jeu
  });

  document.getElementById("exit-button")?.addEventListener("click", () => {
    console.log("Quitter le jeu...");
    window.location.reload();
  });
}

// Lier les actions du menu de pause
bindPauseMenuActions();
