package main

import (
	"bomberman_js/api"
	"fmt"
	"html/template"
	"net/http"
)

// Handler function to handle requests to the root URL
func indexHandler(w http.ResponseWriter, r *http.Request) {
	// Writing a simple response to the client
	file, errParse := template.ParseFiles("./index.html")
	if errParse != nil {
		fmt.Println("Error parsing files: ", errParse)
		return
	}
	errExec := file.Execute(w, nil)
	if errExec != nil {
		fmt.Println("Error: ", errExec)
		return
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()

	mux.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("./src/"))))
	mux.Handle("/images/", http.StripPrefix("/images/", http.FileServer(http.Dir("./images/"))))

	mux.HandleFunc("/", indexHandler)

	api.RegisterLeaderboardHandlers(mux)

	handler := corsMiddleware(mux)

	fmt.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
