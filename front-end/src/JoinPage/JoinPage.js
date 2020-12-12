import React, { Component } from "react";
import { connect, sendMsg } from "../api";

class JoinPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            UserName: "",
            RoomID: ""
        }
    }

    componentDidMount(){
        connect((cbmsg) => {
            if (cbmsg === "true"){
                this.props.joinHandler()
            }
        });
    }
    NameHandler = (event) =>{
        this.setState({
            UserName: event.target.value
        });
    }

    RoomIDHandler = (event) => {
        this.setState({
            RoomID: event.target.value
        });
    }

    JoinRoomHandler = () => {
        let msg = {
            Type: 1,
            UserName: this.state.UserName,
            RoomID: this.state.RoomID
        }
        console.log("sending request to join room", msg);
        sendMsg(msg);
    }

    CreateRoomHandler = () =>{
        let msg = {
            Type: 2,
            UserName: this.state.UserName,
            RoomID: this.state.RoomID
        }
        console.log("sending request to create room", msg);
        sendMsg(msg);
    }

    render(){
        return(
            <div>
                <p> UserName </p>
                <input onChange={this.NameHandler} />
                <p> Room ID </p>
                <input onChange={this.RoomIDHandler} />
                <button onClick={this.JoinRoomHandler}>Join</button>
                <button onClick = {this.CreateRoomHandler}> Create </button>
            </div>
        );
    }
}

export default JoinPage;