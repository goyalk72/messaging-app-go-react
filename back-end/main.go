package main

import (
	"fmt"
	"net/http"

	"github.com/goyalk72/messaging-app-go-react/pkg/websocket"
)

func serveWs(pools *websocket.AllPools, w http.ResponseWriter, r *http.Request) {

	fmt.Println("WebSocket EndPoint Hit")
	ws, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+V\n", err)
	}

	client := &websocket.Client{
		Conn: ws,
	}
	// pool.Register <- client
	client.Read(pools)
}

func setupRoutes() {
	pools := websocket.NewAllPools()
	go pools.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pools, w, r)
	})
}

func main() {
	fmt.Println("Distributed Chat App v0.01")
	setupRoutes()
	http.ListenAndServe(":8080", nil)
}
