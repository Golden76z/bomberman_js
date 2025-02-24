package api

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"
)

const (
	scoresPerPage    = 5
	dbFilePath       = "scores.json"
	verificationSalt = "votre_clé_secrète_ici" // Clé secrète pour la vérification
)

var (
	scoresMutex sync.RWMutex
	allScores   []PlayerScore
)

func init() {
	loadScoresFromFile()
}

func loadScoresFromFile() {
	scoresMutex.Lock()
	defer scoresMutex.Unlock()

	// Check if file exists
	if _, err := os.Stat(dbFilePath); os.IsNotExist(err) {
		allScores = []PlayerScore{}
		return
	}

	data, err := os.ReadFile(dbFilePath)
	if err != nil {
		log.Printf("Error reading scores file: %v", err)
		allScores = []PlayerScore{}
		return
	}

	if err := json.Unmarshal(data, &allScores); err != nil {
		log.Printf("No score")
		allScores = []PlayerScore{}
	}
}

func saveScoresToFile() {
	scoresMutex.RLock()
	defer scoresMutex.RUnlock()

	data, err := json.MarshalIndent(allScores, "", "  ")
	if err != nil {
		log.Printf("Error serializing scores: %v", err)
		return
	}

	if err := os.WriteFile(dbFilePath, data, 0644); err != nil {
		log.Printf("Error writing scores file: %v", err)
	}
}

func getScoreHandler(w http.ResponseWriter, r *http.Request) {
	// Parse page parameter
	pageStr := r.URL.Query().Get("page")
	page := 1
	var err error
	if pageStr != "" {
		page, err = strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = 1
		}
	}

	playerName := r.URL.Query().Get("player")

	response := getPaginatedScores(page, playerName)

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Error generating response", http.StatusInternalServerError)
	}
}

// addScoreHandler handles POST requests to add a new score
func addScoreHandler(w http.ResponseWriter, r *http.Request) {
	referer := r.Header.Get("Referer")
	if referer == "" || !isValidReferer(referer) {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var newScore PlayerScore
	if err := json.NewDecoder(r.Body).Decode(&newScore); err != nil {
		log.Printf("Error request : %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("received score: %+v", newScore)

	if newScore.Name == "" || newScore.Score < 0 || newScore.Time == "" {
		http.Error(w, "Invalid score data", http.StatusBadRequest)
		return
	}

	// Limitation supplémentaire: empêcher les scores excessivement élevés
	if newScore.Score > 100000 { // Ajustez cette valeur selon votre jeu
		log.Printf("Score suspect rejeté: %d", newScore.Score)
		http.Error(w, "Score too high, potentially cheating", http.StatusBadRequest)
		return
	}

	// Ajouter un timestamp pour limiter les soumissions multiples
	newScore.SubmittedAt = time.Now().Unix()

	// Vérifier si le joueur a déjà soumis un score récemment
	if isRecentSubmission(newScore.Name) {
		http.Error(w, "Too many submissions in a short time", http.StatusTooManyRequests)
		return
	}

	// Add score to database
	scoresMutex.Lock()
	allScores = append(allScores, newScore)
	scoresMutex.Unlock()

	// Save to file
	saveScoresToFile()

	// Calculate rank and percentile
	rank, percentile := calculateRankAndPercentile(newScore.Score)

	response := map[string]interface{}{
		"rank":       rank,
		"percentile": percentile,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Error generating response", http.StatusInternalServerError)
	}
}

func isValidReferer(referer string) bool {
    return referer != "" && strings.Contains(referer, "localhost:8080")
}

func isRecentSubmission(playerName string) bool {
	const cooldownPeriod = 1 * 60
	currentTime := time.Now().Unix()

	scoresMutex.RLock()
	defer scoresMutex.RUnlock()

	for _, score := range allScores {
		if score.Name == playerName && (currentTime - score.SubmittedAt) < cooldownPeriod {
			return true
		}
	}
	return false
}

func getPaginatedScores(page int, playerName string) ScoreResponse {
	scoresMutex.RLock()
	defer scoresMutex.RUnlock()

	sortedScores := make([]PlayerScore, len(allScores))
	copy(sortedScores, allScores)

	sort.Slice(sortedScores, func(i, j int) bool {
		return sortedScores[i].Score > sortedScores[j].Score
	})

	// Calculate total pages
	totalScores := len(sortedScores)
	totalPages := int(math.Ceil(float64(totalScores) / float64(scoresPerPage)))
	if totalPages == 0 {
		totalPages = 1
	}

	// Ensure page is within valid range
	if page > totalPages {
		page = totalPages
	}

	startIdx := (page - 1) * scoresPerPage
	endIdx := startIdx + scoresPerPage
	if endIdx > totalScores {
		endIdx = totalScores
	}

	rankedScores := make([]ScoreWithRank, 0, endIdx-startIdx)
	for i := startIdx; i < endIdx; i++ {
		rankedScores = append(rankedScores, ScoreWithRank{
			Name:  sortedScores[i].Name,
			Rank:  i + 1,
			Score: sortedScores[i].Score,
			Time:  sortedScores[i].Time,
		})
	}

	response := ScoreResponse{
		Scores:       rankedScores,
		TotalPages:   totalPages,
		CurrentPage:  page,
		TotalPlayers: totalScores,
	}

	// If player name provided, find their rank and percentile
	if playerName != "" {
		for i, score := range sortedScores {
			if score.Name == playerName {
				response.PlayerRank = i + 1
				response.Percentile = calculatePercentile(i + 1, totalScores)
				break
			}
		}
	}

	return response
}

func calculateRankAndPercentile(newScore int) (int, float64) {
	scoresMutex.RLock()
	defer scoresMutex.RUnlock()

	higherScores := 0
	for _, score := range allScores {
		if score.Score >= newScore {
			higherScores++
		}
	}

	rank := higherScores + 1

	// Calculate percentile
	totalPlayers := len(allScores) + 1
	percentile := calculatePercentile(rank, totalPlayers)

	return rank, percentile
}

func calculatePercentile(rank, total int) float64 {
	if total == 0 {
		return 100.0
	}
	return math.Round((float64(total-rank) / float64(total)) * 100.0)
}

// scoreboardHandler handles both GET and POST requests
func scoreboardHandler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getScoreHandler(w, r)
	case http.MethodPost:
		addScoreHandler(w, r)
	case http.MethodOptions:
		// Handled by CORS middleware
		return
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// RegisterLeaderboardHandlers registers the API routes with the provided mux
func RegisterLeaderboardHandlers(mux *http.ServeMux) {
	mux.HandleFunc("/api/scores", scoreboardHandler)
}
