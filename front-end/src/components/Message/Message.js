import React, { Component } from "react";
import styles from "./Message.module.css";

const JOIN = 1;
const CREATE = 2;
const CHAT = 3;
const DISCONNECT = 4;

class Message extends Component {
    constructor(props){
        super(props);
        let temp = JSON.parse(this.props.message);
        this.state = {
            message: temp
        };
    }

    render() {
        var msgStyle;
        switch(this.state.message.Type){
            case JOIN:
                msgStyle = (<div className = {styles.MessageJoin}>
                                <h3>{this.state.message.Body}</h3>
                            </div>);
                break;
            case CREATE:
                msgStyle = (<div className = {styles.MessageJoin}>
                    <h3>{this.state.message.Body}</h3>
                </div>);
                break;
            case DISCONNECT:
                msgStyle = 
                    (<div className = {styles.MessageDisjoin}>
                        {this.state.message.Body}
                    </div>);
                break;
            case CHAT:
                msgStyle = this.props.username === this.state.message.Username ? (<div className = {styles.MessageMe}>
                    {this.state.message.Body}
                 </div>) : (<div className = {styles.MessageOther}>
                   <b>{this.state.message.Username}</b> {this.state.message.Body}
                </div>);
                break;
            default:
                break;
        }
        return (
            <div>
                {msgStyle}
            </div>
        
        );
    }
}

export default Message;