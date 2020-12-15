import React from 'react';
import styles from "./Header.module.css";

const Header = (props) => (
    <div className = {styles.header}>
        <h2> Realtime Chat App </h2>
        <h2> Room ID: {props.roomID}</h2>
        <h2> UserName: {props.username}</h2>
        <button onClick={() => props.Exithandler()} className={styles.exit}> EXIT </button>
    </div>
);

export default Header;
