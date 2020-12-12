import React, { Component } from 'react';
import { connect, sendMsg } from "./api";
import Header from "./components/Header/Header";
import ChatHistory from "./components/ChatHistory/ChatHistory";
import ChatInput from "./components/ChatInput/ChatInput";

class ChatRoom extends Component {
  constructor(props){
    super(props);
    this.state = {
      chatHistory: []
    }
    connect();
  }

  componentDidMount() {
    connect((msg) => {
      console.log("New Message")
      this.setState(prevState => ({
        chatHistory: [...this.state.chatHistory, msg]
      }))
      console.log(this.state);
    })
  }

  send = (event) => {
    if (event.keyCode === 13){
        let msg = {
            Type: 3,
            Message: event.target.value
        };
      sendMsg(msg);
      event.target.value = "";
    }
    
  }

  render() {
    return(
      <div className = "App">
        <Header />
        <ChatHistory chatHistory = {this.state.chatHistory} />
        <ChatInput send = {this.send} />
      </div>
    );
  }
}

export default ChatRoom;