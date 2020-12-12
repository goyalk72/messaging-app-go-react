import React, { Component } from 'react';
import { connect } from "./api";
import ChatRoom from "./ChatRoom";
import JoinPage from "./JoinPage/JoinPage";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      RoomCreated: false,
    }
    connect();
  }

  ChatRoomJoinHandler = () =>{
    this.setState({
      RoomCreated : true
    });
  }
  // componentDidMount() {
  //   connect((msg) => {
  //     console.log("New Message")
  //     this.setState(prevState => ({
  //       chatHistory: [...this.state.chatHistory, msg]
  //     }))
  //     console.log(this.state);
  //   })
  // }

  // send = (event) => {
  //   if (event.keyCode === 13){
  //     sendMsg(event.target.value);
  //     event.target.value = "";
  //   }
    
  // }

  render() {
    return(
      <div className = "App">
        { this.state.RoomCreated ? <ChatRoom /> : <JoinPage joinHandler={this.ChatRoomJoinHandler}/> }
      </div>
    );
  }
}

export default App;