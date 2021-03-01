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
  const [x_next, set_x_next] = useState(true);
  const winner = calculateWinner(board);
  
  //login state
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [isShown, setShown] = useState(false);
  
  //current user state
  const [currUser, setcurrUser] = useState();
  
  //spectator state
  const [spectatorList, setSpectatorList] = useState([]);
  const playerX = userList[0];
  const playerY = userList[1];
  
  function onClickAddtoList() {
    const username = inputRef.current.value;
    if(username == ""){
      alert("Enter a valid name.");
      return;
    }
    else if(username != null){
      setShown((prevShown) => {
      return !prevShown;
    });
    }
    
    setcurrUser((prevcurrUser)=>username);
    console.log("currUser from login func: ", currUser);
    
    setUserList(prevList => [...prevList, username]);
    //console.log(userList);
    
    socket.emit('login', { username: username });
  }
  
  //console.log(userList);
  
  // The function inside useEffect is only run whenever any variable in the array
  // (passed as the second arg to useEffect) changes. Since this array is empty
  // here, then the function will only run once at the very beginning of mounting.
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('login', (users) => {
      console.log('User list received!');
      console.log("users: ", users);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      const lastuser = users[users.length-1];
      //setcurrUser((prevcurrUser)=>lastuser);
      //console.log("currUser from useeffect: ", lastuser,currUser);
      setUserList(prevUserList => [...prevUserList, lastuser]);
      //const ls = [...users];
      
      if(users.length > 2){
        
        setSpectatorList((prevSpectator) => {
        const specCopy = [...prevSpectator];
        if(users.length > 2){
          specCopy.push(lastuser);
        }
        console.log("spectatorCopy: ",specCopy);
        return specCopy;
        });
        
      }
      
      
    });
  }, []);
  
  
  
  function onShowHide() {
    setShown((prevShown) => {
      return !prevShown;
    });
  }
  
  
  function clickHandler(i) {
    
    const boardCopy = [...board];
  	// If user click an occupied square or if game is won, return
  	if (winner || boardCopy[i]) return;
  	// Put an X or an O in the clicked square
  	
  	if(currUser === playerX || currUser === playerY){
    	boardCopy[i] = x_next ? "X" : "O";
    	set_board(boardCopy);
    	set_x_next(!x_next);
      
      console.log("current user from click handler:", currUser);
      console.log("player x and y", playerX, playerY);
      console.log("spectator list:", spectatorList);
      
        //console.log(currUser);
      socket.emit('board', { squares: boardCopy, isXNext: x_next });
  	}
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
                        setUserList(Array().fill(null));
                        setSpectatorList(Array().fill(null));
                        setShown(false);
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
                {spectatorList.length != 0 ? (
                <div>
                  {spectatorList.map((item, index) => (
                    <li>{item}</li>
                  ))}
                </div>
                ) : (
                  "No spectators have logged in yet"
                )}
                {renderMoves()}
              </div>
            </div>
          ) : (
            "No Users Yet"
          )}
          </div>
  );
}

export default Handler;