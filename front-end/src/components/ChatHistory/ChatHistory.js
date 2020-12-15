import React, { Component } from 'react';
import styles from "./ChatHistory.module.css";
import Message from "../Message/Message";

class ChatHistory extends Component {

    
    render() {
        console.log(this.props.chatHistory);
        const messages = this.props.chatHistory.map(msg => (
            <Message message = {msg.data} username ={this.props.username} />
        ));

        return (
            <div className= {styles.ChatHistory}>
                <h2> Chat History</h2>
                {messages}
            </div>
        );
    }
}

export default ChatHistory;