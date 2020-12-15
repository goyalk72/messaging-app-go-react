import React from 'react';
import styles from "./Login.module.css";

const Login = (props) => {
    let errormsg = props.error.status ? (<div className={styles.Error}>{props.error.message}</div>) : null;
    return (
        <div className={styles.JoinPage}>
          <div className={styles.JoinPageFlex}>
            <div> USERNAME </div>
            <div>
                <input onChange={props.NameHandler} type="text" required placeholder="Enter Name ......"/>
            </div>
          </div>
          <div className={styles.JoinPageFlex}>
            <div> ROOM ID </div>
            <div> <input onChange={props.RoomIDHandler} /> </div>
          </div>
          <div className={styles.JoinPageFlex}>
            <button onClick={props.JoinRoomHandler}>Join</button>
            <button onClick = {props.CreateRoomHandler}> Create </button>
          </div>
          {errormsg}
    </div>
    );
}
export default Login;