let score = 0;
let lives = 1;
let time = 0;
let timerInterval;

function updateScore(pts) {
  score += pts;
  document.getElementById("score").innerText = "Score: " + score;
}

//Timer
export function startTimer() {
  timerInterval = setInterval(function () {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    document.getElementById("timer").innerText =
      "Temps: " +
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);
  }, 1000);
}

//Stop
export function stopTimer() {
  clearInterval(timerInterval);
}

//Live
function updateLives() {
  document.getElementById("lives").innerText = "Vies: " + lives;
}

function decreaseLives() {
  lives--;
  updateLives();
  if (lives <= 0) {
    alert("Game Over");
    stopTimer();
    //ajouter redemarrage ou quitter le jeu
  }
}

startTimer();
updateScore(50);
decreaseLives();
