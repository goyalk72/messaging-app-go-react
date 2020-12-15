package websocket

// Types for different messages

var JOIN = 1
var CREATE = 2
var CHAT = 3
var DISCONNECT = 4
var EXIT = 5
var ERROR = 0

type Message struct {
	Type        int      `"type"`
	RoomID      int      `"roomid"`
	Username    string   `"username"`
	RoomMembers []string `"roommembers"`
	Body        string   `"body"`
}

type RecMessage struct {
	Type     int    `"type"`
	RoomID   int    `"roomid"`
	Username string `"username"`
	Body     string `"body"`
}

func NewMessage(typ int, roomid int, user, body string, members []string) *Message {
	return &Message{
		Type:        typ,
		RoomID:      roomid,
		Username:    user,
		RoomMembers: members,
		Body:        body,
	}
}
