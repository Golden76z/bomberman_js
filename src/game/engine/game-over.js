export function showGameOver() {
  const gameOverContainer = document.getElementById("game-over-container");
  gameOverContainer.classList.add("visible");
  gameOverContainer.classList.remove("hidden");

  document.getElementById("retry-button").onclick = restartGame;
  document.getElementById("main-menu-button").onclick = exitToMenu;
}

function restartGame() {
  score = 0;
  lives = 3;
  timeLeft = 0;
  window.location.reload();
}

function exitToMenu() {
  document.getElementById("game-wrapper").classList.add("hidden");
  document.getElementById("menu-screen").classList.remove("hidden");
  window.location.reload();
}
