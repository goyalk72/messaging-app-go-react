import React, { Component } from "react";
import styles from "./ChatInput.module.css";

class ChatInput extends Component {
    render() {
        return (
            <div className={styles.ChatInput}>
                <input onKeyDown={this.props.send} />
            </div>
        )
    }
}

export default ChatInput;