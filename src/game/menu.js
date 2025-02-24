import { gameInfos } from "./constants/game.js";
import { transitionToNextLevel } from "./engine/checkLevel.js";
window.isPaused = true;

import { initLeaderboard } from "./engine/leaderboard.js";

document.addEventListener("DOMContentLoaded", function () {
  const menuScreen = document.getElementById("menu-screen");
  const gameWrapper = document.getElementById("game-wrapper");
  const settingsButton = document.getElementById("settings-button");
  const settingsPanel = document.getElementById("settings-panel");
  const closeSettingsButton = document.getElementById("close-settings-button");
  const startButton = document.getElementById("start-button");
  const musicVolume = document.getElementById("music-volume");
  const sfxVolume = document.getElementById("sfx-volume");
  const musicValue = document.getElementById("music-value");
  const sfxValue = document.getElementById("sfx-value");

  initLeaderboard();

  // Gestionnaire pour démarrer le jeu
  startButton.addEventListener("click", function () {
    console.log("Start button clicked");
    transitionToNextLevel();
    window.isPaused = false;
    gameInfos.pause = false;

    // Masquer le menu principal et afficher le jeu
    setTimeout(() => {
      menuScreen.classList.add("hidden");
      gameWrapper.classList.remove("hidden");

      // Charger les scripts nécessaires pour le jeu
      loadGameScripts();
    }, 700);
  });

  // Fonction pour charger les scripts du jeu de manière synchrone
  function loadGameScripts() {
    const scripts = [
      "./src/game/engine/player_inputs.js",
      "./src/game/engine/mapGeneration.js",
      "./src/game/engine/pause.js",
      "./src/game/engine/ui_scoring.js", // Charger le script UI également
    ];

    let loadedScripts = 0;

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = src;
      script.onload = () => {
        loadedScripts++;
        // Une fois tous les scripts chargés, initialiser le jeu
        if (loadedScripts === scripts.length) {
          initializeGame();
        }
      };
      script.onerror = (error) => {
        console.error("Erreur de chargement du script:", src, error);
      };
      document.body.appendChild(script);
    });
  }

  // Fonction pour initialiser le jeu une fois les scripts chargés
  function initializeGame() {
    // Initialiser l'interface du jeu
    import("./engine/ui_scoring.js")
      .then((module) => {
        const { startTimer, initializeGameUI } = module;

        // Initialiser l'interface et démarrer le timer
        initializeGameUI();
        startTimer();
      })
      .catch((error) =>
        console.error("Erreur lors du chargement du module UI scoring:", error)
      );
  }

  // Gestionnaire pour ouvrir le panneau de paramètres
  settingsButton.addEventListener("click", function () {
    settingsPanel.classList.add("visible");
    settingsPanel.classList.remove("hidden");
  });

  // Gestionnaire pour fermer le panneau de paramètres
  closeSettingsButton.addEventListener("click", function () {
    settingsPanel.classList.remove("visible");
    settingsPanel.classList.add("hidden");
  });

  // Gestionnaires pour le contrôle du volume
  musicVolume.addEventListener("input", function () {
    musicValue.textContent = this.value;
  });

  sfxVolume.addEventListener("input", function () {
    sfxValue.textContent = this.value;
  });
});
