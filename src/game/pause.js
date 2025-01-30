let isPaused = false;

// Fonction pour basculer entre l'affichage et le masquage du menu de pause
function togglePause() {
	const pauseMenu = document.getElementById("pause-container");

	if (isPaused) {
		pauseMenu.classList.remove("hidden");
	} else {
		pauseMenu.classList.add("hidden");
	}
}

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		isPaused = !isPaused;
		togglePause();
	}
});

document.getElementById("continue-button")?.addEventListener("click", () => {
	console.log("Resume the game...");
	isPaused = false;
	togglePause();
});

document.getElementById("restart-button")?.addEventListener("click", () => {
	console.log("Restarting the game...");

	isPaused = false;
	togglePause();
});

document.getElementById("exit-button")?.addEventListener("click", () => {
	console.log("Exiting the game...");
	window.location.reload();
});
