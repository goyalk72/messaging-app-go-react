package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID       string
	Conn     *websocket.Conn
	Pool     *Pool
	Allpools *AllPools
}

// type Message struct {
// 	Type     int    `json:"type"`
// 	Body     string `json:"body"`
// 	UserName string `json:"username"`
// }

// type RoomRequest struct {
// 	Type     int    `json:"type"`
// 	UserName string `json:"userName"`
// 	RoomID   string `json:"roomID"`
// }

// type ChatMessage struct {
// 	Type     int    `json:"Type"`
// 	UserName string `json:"UserName"`
// 	Message  string `json:"Message"`
// }

func (c *Client) CreateOrJoinRoom() {

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		var rec RecMessage
		if err := json.Unmarshal(p, &rec); err != nil {
			log.Printf(" Error getting room : %+v\n", err)
			return
		}

		if rec.Type == CREATE {
			pool := NewPool()
			c.Allpools.Register <- pool
			go pool.Start()
			c.Pool = pool
			c.ID = rec.Username
			pool.Register <- c
			break
		} else if rec.Type == JOIN {
			pool := c.Allpools.Check(rec.RoomID)
			if pool != nil {
				if pool.CheckUsername(rec.Username) {
					c.Pool = pool
					c.ID = rec.Username
					pool.Register <- c
					break
				} else {
					message := Message{Type: ERROR, Body: "Username already exists"}
					c.Conn.WriteJSON(message)
				}

			} else {
				message := Message{Type: ERROR, Body: "Enter correct Room ID"}
				c.Conn.WriteJSON(message)
			}
		}
	}
	fmt.Println("Now reading msgs")
	c.Read()

}

func (c *Client) Read() {

	defer func() {
		deletepool := false
		pool := c.Pool
		if len(c.Pool.Clients) == 1 {
			deletepool = true
		}
		c.Pool.Unregister <- c
		if deletepool {
			c.Allpools.Unregister <- pool
		}
		c.CreateOrJoinRoom()
	}()

	for {

		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		var rec RecMessage
		if err := json.Unmarshal(p, &rec); err != nil {
			fmt.Printf(" Error getting chat : %+v\n", err)
		}
		if rec.Type == EXIT {
			log.Println("The user wants to leave the chat room")
			return
		}
		message := Message{Type: CHAT, RoomID: c.Pool.ID, Username: c.ID, Body: rec.Body}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
