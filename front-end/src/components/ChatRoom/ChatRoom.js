import React from 'react';
import Header from "../Header/Header";
import ChatHistory from "../ChatHistory/ChatHistory";
import ChatInput from "../ChatInput/ChatInput";

const ChatRoom = (props) => {
    return (
        <div>
            <Header 
            roomID={props.roomid} 
            username={props.username} 
            members={props.members} 
            Exithandler= {props.Exithandler}/>
            <ChatHistory chatHistory = {props.chatHistory} username={props.username} />
            <ChatInput send = {props.send} /> 
        </div>
    );
}

export default ChatRoom;