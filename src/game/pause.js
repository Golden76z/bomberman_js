let isPaused = false;

// Fonction pour basculer entre l'affichage et le masquage du menu de pause
function togglePause() {
	const pauseMenu = document.getElementById("pause-container");

	if (!pauseMenu) {
		console.error("Le menu de pause n'a pas été trouvé dans le DOM.");
		return;
	}

	console.log("isPaused:", isPaused);

	if (isPaused) {
		pauseMenu.classList.add("visible");
	} else {
		pauseMenu.classList.remove("visible");
	}
}

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		isPaused = !isPaused;
		togglePause();
	}
});

document.getElementById("continue-button")?.addEventListener("click", () => {
	console.log("Continuer le jeu...");
	isPaused = false;
	togglePause();
});

document.getElementById("restart-button")?.addEventListener("click", () => {
	console.log("Redémarrage du jeu...");
	isPaused = false;
	togglePause();
});

document.getElementById("exit-button")?.addEventListener("click", () => {
	console.log("Quitter le jeu...");
	window.location.reload();
});
