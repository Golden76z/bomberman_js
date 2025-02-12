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

  // Importer les fonctions nécessaires
  import("./engine/ui_scoring.js")
    .then((module) => {
      const { startTimer, initializeGameUI } = module;

      // Gestionnaire pour le bouton Start
      startButton.addEventListener("click", function () {
        console.log("Start button clicked");

        // Masquer le menu settings s'il est affiché
        if (!settingsPanel.classList.contains("hidden")) {
          settingsPanel.classList.add("hidden");
          settingsPanel.classList.remove("visible");
        }

        // Cacher le menu principal et afficher le jeu
        menuScreen.classList.add("hidden");
        gameWrapper.classList.remove("hidden");

        // Initialiser l'interface du jeu et démarrer le timer
        initializeGameUI();
        startTimer();

        // Charger les scripts du jeu
        loadGameScripts();
      });
    })
    .catch((error) => console.error("Error loading UI scoring module:", error));

  // Gestionnaire pour le bouton Settings
  settingsButton.addEventListener("click", function () {
    settingsPanel.classList.add("visible");
    settingsPanel.classList.remove("hidden");
  });

  // Gestionnaire pour le bouton de fermeture du panneau de paramètres
  closeSettingsButton.addEventListener("click", function () {
    settingsPanel.classList.remove("visible");
    settingsPanel.classList.add("hidden");
  });

  // Gestionnaires pour les contrôles de volume
  musicVolume.addEventListener("input", function () {
    musicValue.textContent = this.value;
  });

  sfxVolume.addEventListener("input", function () {
    sfxValue.textContent = this.value;
  });
});

// Fonction pour charger les scripts du jeu
function loadGameScripts() {
  const scripts = [
    "./src/game/engine/mapGeneration.js",
    "./src/game/engine/player_inputs.js",
    "./src/game/engine/pause.js",
  ];

  scripts.forEach((src) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = src;
    document.body.appendChild(script);
  });
}
