package api

type PlayerScore struct {
	Name        string `json:"name"`
	Score       int    `json:"score"`
	Time        string `json:"time"`
	SubmittedAt int64  `json:"submittedAt"`
}

type ScoreResponse struct {
	Scores       []ScoreWithRank `json:"scores"`
	TotalPages   int             `json:"totalPages"`
	CurrentPage  int             `json:"currentPage"`
	PlayerRank   int             `json:"playerRank"`
	Percentile   float64         `json:"percentile"`
	TotalPlayers int             `json:"totalPlayers"`
}

type ScoreWithRank struct {
	Name  string `json:"name"`
	Rank  int    `json:"rank"`
	Score int    `json:"score"`
	Time  string `json:"time"`
}
