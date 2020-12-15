package main

import (
	"fmt"
	"net/http"

	"github.com/goyalk72/messaging-app-go-react/pkg/websocket"
)

func serveWs(allpools *websocket.AllPools, w http.ResponseWriter, r *http.Request) {

	fmt.Println("WebSocket EndPoint Hit")
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+V\n", err)
	}

	client := &websocket.Client{
		Conn:     ws,
		Allpools: allpools,
	}

	client.CreateOrJoinRoom()
}

func setupRoutes() {
	allpools := websocket.NewAllPools()
	go allpools.Start()

	http.Handle("/", http.FileServer(http.Dir("../front-end/build")))

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(allpools, w, r)
	})
}

func main() {
	fmt.Println("Distributed Chat App v0.01")
	setupRoutes()
	http.ListenAndServe(":8080", nil)
}
