package websocket

import (
	"fmt"
	"math/rand"
)

type Pool struct {
	ID         int
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		ID:         rand.Intn(100000000),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) CheckUsername(name string) bool {
	for client := range pool.Clients {
		if client.ID == name {
			return false
		}
	}
	return true
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			newClient := client
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			var allClients []string
			for client := range pool.Clients {
				allClients = append(allClients, client.ID)
			}
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(NewMessage(JOIN, pool.ID, newClient.ID, newClient.ID+" has joined....", allClients))
			}
			break
		case client := <-pool.Unregister:
			newClient := client
			newClient.Conn.WriteJSON(Message{Type: EXIT, Username: newClient.ID, RoomID: pool.ID, Body: "Want to disconnect"})
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			var allClients []string
			for client := range pool.Clients {
				allClients = append(allClients, client.ID)
			}
			for client, _ := range pool.Clients {
				client.Conn.WriteJSON(NewMessage(DISCONNECT, pool.ID, newClient.ID, newClient.ID+" has disconnected....", allClients))
			}
			break
		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client, _ := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
