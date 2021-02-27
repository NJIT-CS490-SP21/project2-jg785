import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Board from './Board';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection io()

//use <func name /> to call func in app.js
function Handler () {
  const [board, set_board] = useState([Array(9).fill(null)]);
  const [index, set_index] = useState(0);
  const [x_next, set_x_next] = useState(true);
  
  //login state
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [isShown, setShown] = useState(true);
  
  function onClickAddtoList() {
    const username = inputRef.current.value;
    setUserList((prevList) => {
      const listCopy = [...prevList];
      listCopy.push(username);
      return listCopy;
    });
    socket.emit('login', { username: username });
  }
  
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('login', (users) => {
      console.log('User list received!');
      console.log(users);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setUserList(prevUserList => [...prevUserList, users]);
    });
  }, []);
  
  function onShowHide() {
    setShown((prevShown) => {
      return !prevShown;
    });
  }
  
  
  function clickHandler(i) {
    const inBoard = board.slice(0, index + 1);
    const curr = inBoard[index];
    const squares = [...curr];
    
    //set letter inside button
    squares[i] = x_next ? 'X' : 'O';
    set_board([...inBoard, squares]);
    set_index(inBoard.length);
    set_x_next(!x_next);
    
    //emit an event
    //var num = squares[i]
    //set_board(prevBoard => [...prevBoard, squares ]);
    socket.emit('board', { squares: squares });
  };
  
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('board', (data) => {
      console.log('Board event received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      
      set_board([data.squares, data.squares, data.squares,
                data.squares, data.squares, data.squares]);
      
    });
  }, []);
  
  return (
          <div>
          <h1>Play Tic Tac Toe, Enjoy!</h1>
          <div>
              <button onClick={() => onShowHide()}>Show/Hide list button</button>
          </div>
          <input ref={inputRef} type="text" />
          <button onClick={() => onClickAddtoList()}>Log in</button>
          {isShown === true ? (
            <div>
              <div>
                {userList.map((item, index) => (
                  <li>{item}</li>
                ))}
              </div>
              <Board squares={board[index]} onClick={clickHandler} />
            </div>
          ) : (
            "Not True"
          )}
          </div>
  );
}

export default Handler;