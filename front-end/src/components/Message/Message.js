import React, { Component } from "react";
import styles from "./Message.module.css";

class Message extends Component {
    constructor(props){
        super(props);
        let temp = JSON.parse(this.props.message);
        this.state = {
            message: temp
        };
    }

    render() {
        return (
        <div className = {styles.Message}>
            {this.state.message.Body}
        </div>
        );
    }
}

export default Message;