package main

import (
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

func main() {
	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("./src/"))))
	http.HandleFunc("/", indexHandler)

	fmt.Println("Server is running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Error starting server:", err)
	}
}
