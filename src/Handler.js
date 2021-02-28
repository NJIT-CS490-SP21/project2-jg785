import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Board from './Board';
import calculateWinner from './winner';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection io()

const styles = {
    width: '200px',
    margin: '20px auto',
};

//use <func name /> to call func in app.js
function Handler () {
  const [board, set_board] = useState(Array(9).fill(null));
  //const [index, set_index] = useState(0);
  const [x_next, set_x_next] = useState(true);
  const winner = calculateWinner(board);
  
  //login state
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [isShown, setShown] = useState(true);
  
  //username state
  const [move, set_move] = useState(true);
  
  function onClickAddtoList() {
    const username = inputRef.current.value;
    //set_username = (username);
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
    //const inBoard = board.slice(0, index + 1);
    //const curr = inBoard[index];
    //const squares = [...curr];
    
    //set letter inside button
    //squares[i] = x_next ? 'X' : 'O';
    //set_board([...inBoard, squares]);
    //set_index(inBoard.length);
    //set_x_next(!x_next);
    
    //emit an event
    //var num = squares[i]
    //set_board(prevBoard => [...prevBoard, squares ]);
    
    const boardCopy = [...board];
  	// If user click an occupied square or if game is won, return
  	if (winner || boardCopy[i]) return;
  	// Put an X or an O in the clicked square
  	boardCopy[i] = x_next ? "X" : "O";
  	set_board(boardCopy);
  	set_x_next(!x_next);
    
    socket.emit('board', { squares: boardCopy, isXNext: x_next });
  }
  
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
      set_x_next(!data.isXNext);
      set_board((prevBoard) => [...data.squares]);
      
    });
  }, []);
  
  function renderMoves () {
      //Restart the Game
      return( <button onClick={() => {
                        set_board(Array(9).fill(null));
                        set_x_next(true);
                      }}>
                  Start Game
              </button>
      );
  }
  
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
              <Board squares={board} onClick={clickHandler} />
              <div style={styles}>
                <p>{winner ? "Winner: " + winner : "Next Player: " + (x_next ? "X" : "O")}</p>
                {renderMoves()}
              </div>
            </div>
          ) : (
            "Not True"
          )}
          </div>
  );
}

export default Handler;