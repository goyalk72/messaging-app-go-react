package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
}

type Message struct {
	Type int    `json:"type"`
	Body string `json:"body"`
}

type RoomRequest struct {
	Type     int    `json:"Type"`
	UserName string `json:"UserName"`
	RoomID   string `json:"RoomID"`
}

type ChatMessage struct {
	Type    int    `json:"Type"`
	Message string `json:"Message"`
}

func (c *Client) Read(pools *AllPools) {

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		var r RoomRequest
		if err := json.Unmarshal(p, &r); err != nil {
			fmt.Printf(" Error getting room : %+v\n", err)
		}
		if r.Type == 2 {
			pool := NewPool()
			pools.Register <- pool
			go pool.Start()
			c.Pool = pool
			pool.Register <- c
			break
		} else if r.Type == 1 {
			if pool := pools.Check(r.RoomID); pool != nil {
				c.Pool = pool
				pool.Register <- c
				break
			}
		}

		c.Readmsgs()

	}
}

func (c *Client) Readmsgs() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		var r ChatMessage
		if err := json.Unmarshal(p, &r); err != nil {
			fmt.Printf(" Error getting chat : %+v\n", err)
		}
		message := Message{Type: messageType, Body: r.Message}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
