const API_URL = "/api/scores";
let currentPage = 1;
let playerName = "";
let hasSubmittedScore = false;

async function loadLeaderboard(page = 1, targetElement = "menu") {
  try {
    const response = await fetch(`${API_URL}?page=${page}`);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    const data = await response.json();
    displayLeaderboard(data, targetElement);
    updatePagination(data, targetElement);
    return data;
  } catch (e) {
    console.error("Error loading leaderboard:", e);
    return null;
  }
}

function displayLeaderboard(data, targetElement) {
  const container =
    targetElement === "menu"
      ? document.querySelector("#leaderboard-panel .leaderboard-scores")
      : document.querySelector(`.leaderboard-game-over .leaderboard-scores`);

  if (!container) {
    console.error(`Leaderboard container error ${targetElement}`);
    return;
  }

  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "leaderboard-table";

  const thead = document.createElement("thead");
  thead.innerHTML = `
  <tr>
    <th>Rank</th>
    <th>Name</th>
    <th>Score</th>
    <th>Time</th>
  </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  if (data.scores && data.scores.length > 0) {
    data.scores.forEach((score) => {
      const row = document.createElement("tr");

      if (score.name === playerName) {
        row.className = "player-score";
      }

      row.innerHTML = `
      <td>${score.rank}${getRankSuffix(score.rank)}</td>
      <td>${score.name}</td>
      <td>${score.score.toLocaleString()}</td>
      <td>${score.time}</td>
      `;
      tbody.appendChild(row);
    });
  } else {
    const emptyrow = document.createElement("tr");
    emptyrow.innerHTML = '<td colspan="4">No scores found</td>';
    tbody.appendChild(emptyrow);
  }

  table.appendChild(tbody);
  container.appendChild(table);

  if (data.playerRank && data.percentile) {
    const playerStats = document.createElement("div");
    playerStats.className = "player-stats";
    playerStats.innerHTML = `
    <p> Congrats ${playerName} ! You are in top ${data.percentile.toFixed(1)}%,
     on the ${data.playerRank}${getRankSuffix(data.playerRank)} place !</p>
    `;
    container.appendChild(playerStats);
  }
}

function updatePagination(data, targetElement) {
  const container =
    targetElement === "menu"
      ? document.querySelector("#leaderboard-panel .pagination")
      : document.querySelector(".leaderboard-game-over .pagination");

  if (!container) return;

  const pageInfo = container.querySelector(".page-info");
  const prevButton = container.querySelector("#prev-page");
  const nextButton = container.querySelector("#next-page");

  if (pageInfo) {
    pageInfo.textContent = `Page ${data.currentPage} of ${data.totalPages}`;
  }

  if (prevButton) {
    prevButton.disabled = data.currentPage <= 1;
    prevButton.onclick = () => {
      if (data.currentPage > 1) {
        loadLeaderboard(data.currentPage - 1, targetElement);
      }
    };
  }

  if (nextButton) {
    nextButton.disabled = data.currentPage >= data.totalPages;
    nextButton.onclick = () => {
      if (data.currentPage < data.totalPages) {
        loadLeaderboard(data.currentPage + 1, targetElement);
      }
    };
  }
}
async function submitScore(name, score, time) {
  try {
    if (hasSubmittedScore) {
      console.log("Score déjà soumis. Pas de nouvel envoi.");
      return null;
    }
    playerName = name;

    const ScoreData = {
      name: name,
      score: score,
      time: time,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ScoreData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit score");
    }
    hasSubmittedScore = true;

    const result = await response.json();

    const leaderboardData = await fetch(`${API_URL}?player=${name}`);
    const leaderboardResult = await leaderboardData.json();

    displayLeaderboard(leaderboardResult, "gameOver");
    updatePagination(leaderboardResult, "gameOver");

    document.getElementById("player-name-input").style.display = "none";

    return result;
  } catch (error) {
    console.error("Error submitting score:", error);
    return null;
  }
}

function getRankSuffix(rank) {
  if (rank >= 11 && rank <= 13) {
    return "th";
  }

  switch (rank % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function initLeaderboard() {
  const leaderboardButton = document.getElementById("leaderboard-button");
  const leaderboardPanel = document.getElementById("leaderboard-panel");
  const closeLeaderboardButton = document.getElementById(
    "close-leaderboard-button"
  );

  if (leaderboardButton) {
    leaderboardButton.addEventListener("click", () => {
      leaderboardPanel.classList.remove("hidden");
      leaderboardPanel.classList.add("visible");
      loadLeaderboard(1, "menu");
    });
  }

  if (closeLeaderboardButton) {
    closeLeaderboardButton.addEventListener("click", () => {
      leaderboardPanel.classList.remove("visible");
      leaderboardPanel.classList.add("hidden");
    });
  }

  const submitNameButton = document.getElementById("submit-name-button");
  const playerNameInput = document.getElementById("player-name");

  if (submitNameButton) {
    submitNameButton.addEventListener("click", () => {
      const name = playerNameInput.value.trim();
      if (!name) {
        alert("Please enter a name");
        return;
      }

      const gameScore = window.score || 0;
      const gameTime =
        document.getElementById("timer")?.textContent?.replace("Temps: ", "") ||
        "00:00";

      document.getElementById("end-game-score").textContent = gameScore;

      submitScore(name, gameScore, gameTime);

      submitNameButton.disabled = true;
    });
  }

  window.addEventListener("gameRestart", function () {
    hasSubmittedScore = false;
  });
}

export function resetSubmissionStates() {
  hasSubmittedScore = false;
}

export { loadLeaderboard, submitScore, initLeaderboard };
