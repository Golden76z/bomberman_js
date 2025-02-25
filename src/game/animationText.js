export function showStory(storyText, callback) {
  const screen = document.getElementById("storyScreen");
  const textContainer = document.getElementById("storyText");
  textContainer.textContent = ""

  screen.style.opacity = "1"; // Fade in the screen

  let index = 0;
  function typeLetter() {
    if (index < storyText.length) {
      textContainer.textContent += storyText[index];
      index++;
      setTimeout(typeLetter, 50); // Speed of text appearing
    } else {
      waitForKeyPress(callback);
    }
  }

  setTimeout(typeLetter, 1000); // Start typing after fade-in
}

export function waitForKeyPress(callback) {
  document.addEventListener("keydown", function fadeOutStory(event) {
    document.removeEventListener("keydown", fadeOutStory); // Prevent multiple triggers
    const screen = document.getElementById("storyScreen");
    screen.style.opacity = "0"; // Fade out
    setTimeout(() => {
      callback()
    }, 200)
  });
}

// function startGame() {
//   console.log("Game starts now!");
//   // Add your game start logic here
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const story = "In the heart of Blastron, chaos looms. You, the last Bomber, must reclaim the city!";
//   showStory(story, startGame);
// });
