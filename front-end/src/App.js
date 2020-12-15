import React, { Component } from 'react';
import "./App.css";
import { connect, sendMsg } from "./api";
import ChatRoom from './components/ChatRoom/ChatRoom';
import Login from './components/LoginPage/Login';


const JOIN = 1;
const CREATE = 2;
const CHAT = 3;
const DISCONNECT = 4;
const EXIT = 5;
const ERROR = 0;

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      chatHistory: [],
      RoomJoined: false,
      Username: "",
      RoomID: -1,
      Members: [],
      error: {
        status: false,
        message: ""
      }
    }
    connect();
  }

  componentDidMount() {
    connect((msg) => {
      var pmsg = JSON.parse(msg.data);
      console.log(pmsg.Type);
      switch(pmsg.Type) {
        case JOIN:
          console.log("Join Request approved");
          this.setState(state => ({
            RoomJoined: true,
            RoomID: parseInt(pmsg.RoomID,10),
            Members: pmsg.RoomMembers,
            chatHistory: [...this.state.chatHistory,msg],
            error: {
              status: false,
              message: ""
            }
          }));
          break;
        case CHAT:
          console.log("New message recieved");
          this.setState((state) => ({
            chatHistory: [...this.state.chatHistory,msg],
            error: {
              status: false,
              message: ""
            }
          }));
          break;
        case DISCONNECT:
          console.log(" A User has been disconnected");
          this.setState((state) => ({
            chatHistory: [...this.state.chatHistory,msg],
            Members: pmsg.RoomMembers,
            error: {
              status: false,
              message: ""
            }
          }));
          break;
        case EXIT:
          console.log(" User has been disconnected");
          this.setState((state) => ({
            chatHistory: [],
            RoomJoined: false,
            RoomID: -1,
            UserName: "",
            Members: [],
            error: {
              status: false,
              message: ""
            }
          }));
          break;
        case ERROR:
          console.log("An error has occured");
          this.setState((state) => ({
            error: {
              status: true,
              message: pmsg.Body
            }
          }));
          break;
        default:
          break;
      }
    });
  }

  Message = (type,username,roomid,body) => {
    let msg = {
      type: type,
      username: username,
      roomid: roomid,
      body: body
    }
    return msg
  }

  CheckUserName = () => {
    if (this.state.Username.length === 0 ){
      console.log("Username is empty");
      this.setState(state => ({
        error: {
          status : true,
          message: "Username can not be empty"
        }
      }));
      return false;
    }
    return true;
  }

  CheckRoomID = () => {
    if (this.state.RoomID.length === 0) {
      this.setState(state => ({
        error: {
          status : true,
          message: "Roomid can not be empty"
        }
      }));
      return false;
    }

    if (isNaN(this.state.RoomID)) {
      this.setState(state => ({
        error: {
          status : true,
          message: "Roomid must be a number"
        }
      }));
      return false;
    }
    return true;
  }

  NameHandler = (event) =>{
    this.setState({
        Username: event.target.value
    });
  }

  RoomIDHandler = (event) => {
      this.setState({
          RoomID: parseInt(event.target.value,10)
      });
  }

  JoinRoomHandler = () => {
    if (this.CheckUserName() && this.CheckRoomID()) {
      let msg = this.Message(JOIN,this.state.Username,this.state.RoomID,"");
      msg = JSON.stringify(msg)
      console.log("sending request to join room", msg);
      sendMsg(msg);
    }
  }

  CreateRoomHandler = () =>{
    if (this.CheckUserName()) {
      let msg = this.Message(CREATE,this.state.Username,this.state.RoomID,"");
      msg = JSON.stringify(msg)
      console.log("sending request to create room", msg);
      sendMsg(msg);
    }
  }
  ExitHandler = () => {
    let msg = this.Message(EXIT,this.state.Username,this.state.RoomID,"disconnect")
    msg = JSON.stringify(msg)
    console.log("sending request to exit room", msg);
    sendMsg(msg);
    // this.setState((state) => ({
    //   chatHistory: [],
    //   RoomJoined: false,
    //   RoomID: -1,
    //   UserName: "",
    //   Members: [],
    //   error: {
    //     status: false,
    //     message: ""
    //   }
    // }));
  }

  send = (event) => {
    if (event.keyCode === 13){
        let msg = this.Message(CHAT,this.state.Username,this.state.RoomID,event.target.value)
        msg = JSON.stringify(msg)
        sendMsg(msg);
      event.target.value = "";
    }
    
  }

  render() {
      let page = this.state.RoomJoined ? 
      ( <div><ChatRoom 
        roomid={this.state.RoomID}
        username={this.state.Username}
        members={this.state.Members}
        chatHistory={this.state.chatHistory}
        send={this.send} 
        Exithandler={this.ExitHandler} /> 
      </div> ) 
      : ( <div >
          <Login 
          error={this.state.error}
          NameHandler={this.NameHandler}
          RoomIDHandler={this.RoomIDHandler}
          CreateRoomHandler={this.CreateRoomHandler}
          JoinRoomHandler={this.JoinRoomHandler} /> </div>);
      return(
        <div className = "App">
          {page}
        </div>
      );
  }
}

export default App;