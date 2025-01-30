export const gameContainer = document.getElementById("game");

const images = {
    0: "/images/empty.png",
    1: "/images/wall.png",
    2: "/images/block.png",
    3: "/images/player.png"
};

export function renderMap(map) {
    if (!gameContainer) {
        console.error("Game container not found!");
        return;
    }
    gameContainer.innerHTML = ""; // Clear previous content
    map.forEach(row => {
        row.forEach(tile => {
            const div = document.createElement("div");
            div.classList.add("tile");
            div.style.backgroundImage = `url(${images[tile]})`;
            gameContainer.appendChild(div);
        });
    });
}
