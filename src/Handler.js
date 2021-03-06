import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Board from './Board';
import calculateWinner from './winner';
import io from 'socket.io-client';
import ParticlesBg from 'particles-bg';
//import leaderboard from './Leaderboard';

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
  const playerO = userList[1];
  
  //table shown
  const [tableShown, settableShown] = useState(false);
  
  //Leaderboard state
  const [userLeaderboard, setuserLeaderboard] = useState([]);
  const [rankLeaderboard, setrankLeaderb] = useState([]);
  
  //winner and loser state
  //const [winnerUser, setwinUser] = useState();
  //const [loserUser, setlosUser] = useState();
  
  //if(winner === "X"){
    //setwinUser((prevcurrUser)=>playerX);
  //}
  //else{
    //setlosUser((prevcurrUser)=>playerO);
  //}
  //if(winner === "O"){
    //setwinUser((prevcurrUser)=>playerO);
  //}
  //else{
    //setlosUser((prevcurrUser)=>playerX);
  //}
  
  //console.log("Winner username", winnerUser);
  //console.log("Loser username", loserUser);
  //leaderboard state
  
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
    
    if(userList.length >= 2){
      setSpectatorList(prevUserList => [...prevUserList, username]);
    }
    
    socket.emit('login', { username: username });
    
    //Will make input box empty after user logs in
    inputRef.current.value = "";
  }
  
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
        setSpectatorList(prevUserList => [...prevUserList, lastuser]);
      }
      
    });
  }, []);
  
  //console.log("userList after useeffect", userList);
  //console.log("spectator list after use effect", spectatorList);
  
  //Show/hide Leaderboard
  function onShowHideLeaderBoard() {
    settableShown((prevShown) => {
      return !prevShown;
    });
  }
  
  function clickHandler(i) {
    
    const boardCopy = [...board];
  	// If user click an occupied square or if game is won, return
  	if (winner || boardCopy[i]) return;
  	// Put an X or an O in the clicked square
  	
  	//Only allow first and second user to play. Other players that login,
  	//are spectators.
  	if(currUser === playerX || currUser === playerO){
    	boardCopy[i] = x_next ? "X" : "O";
    	set_board(boardCopy);
    	set_x_next(!x_next);
      
      console.log("current user from click handler:", currUser);
      console.log("player x and o", playerX, playerO);
      //console.log("spectator list:", spectatorList);
      
        //console.log(currUser);
      socket.emit('board', { squares: boardCopy, isXNext: x_next });
  	}
  }
  
  useEffect(() => {
    socket.on('board', (data) => {
      console.log('Board event received!');
      console.log(data);
      
      set_x_next(!data.isXNext);
      set_board((prevBoard) => [...data.squares]);
      
    });
  }, []);
  
  //Leaderboard
  function leaderboard(){
    return (
            <table>
                <thead>
                    <tr>
                        <th colspan="2">Tic Tac Toe Leaderboard</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>Ranking score</td>
                    </tr>
                    <tr>
                      <td>Jhon</td>
                      <td> 25 </td>
                  </tr>
                </tbody>
            </table>
    );
  }
  
  //Restart the Game
  function renderMoves () {
      return( <button onClick={() => {
                        set_board(Array(9).fill(null));
                        set_x_next(true);
                        setUserList(Array().fill(null));
                        setSpectatorList([]);
                        setShown(false);
                        settableShown(false);
                        
                        socket.emit('reset_game', Array(9).fill(null));
                        
                      }}>
                  Play Again!
              </button>
      );
  }
  
  useEffect(() => {
    socket.on('reset_game', (data) => {
      console.log("data", data);
      
      set_board(prevBoard => data);
      set_x_next(true);
      setUserList(Array().fill(null));
      setSpectatorList(Array().fill(null));
      setShown(false);
      settableShown(false);
      
    });
  }, []);
  
  //Place in line 156 is want show/hide button
  //<div>
  //    <button onClick={() => onShowHide()}>Show/Hide list button</button>
  //</div>
  
  //To show user list place inside isShow === true
  
  //<div>
  //  {userList.map((item, index) => (
  //    <li>{item}</li>
  //  ))}
  //</div>
  
  //Check if board is full
  const board_is_full = board.every(element => element !== null);
  console.log(board_is_full);
  
  return (
          
          <div style={styles}>
          <ParticlesBg type="circle" bg={true} />
          <h1>Play Tic Tac Toe, Enjoy!</h1>
          <div>
            <button onClick={() => onShowHideLeaderBoard()}>Show/Hide Leaderboard</button>
            {tableShown === true ? (
              leaderboard()
            ): ("")}
          </div>
          {isShown === false ? (
          <div>
            <input ref={inputRef} type="text" />
            <button onClick={() => onClickAddtoList()}>Log in</button>
          </div>
          ) : ("")}
          {isShown === true ? (
            <div>
              <Board squares={board} onClick={clickHandler} />
              <div>
                <p>Player X: {playerX}</p>
                <p>{playerO ? "Player O: " + playerO : "Player Y hasn't connected yet."}</p>
                <p>{winner ? "Winner: " + winner : "Next Player: " + (x_next ? "X" : "O")}</p>
                {spectatorList.length != 0 ? (
                <div>
                  Spectators:
                  {spectatorList.map((item, index) => (
                    <li>{item}</li>
                  ))}
                </div>
                ) : (
                  "No spectators have logged in yet."
                )}
                { ( (winner == "X") ) ? (
                  <div><br></br> Winner Username: {playerX} <br></br></div>
                ) : ("")}
                { ( (winner == "O") ) ? (
                  <div><br></br> Winner Username: {playerO} <br></br></div>
                ) : ("")}
                
                { ( (winner == "X" || winner == "O") && (currUser == playerX || currUser == playerO) )  ? (
                  <div>{renderMoves()}</div>
                ) : ("")}
                { ( (winner != "X" || winner != "O") && board_is_full ) ? (
                  <div><br></br> It's a draw. No winner in this match. <br></br></div>
                ) : ("")}
                { ( (winner != "X" || winner != "O") && (currUser == playerX || currUser == playerO) && board_is_full) ? (
                  <div>{renderMoves()}</div>
                ) : ("")}
              </div>
            </div>
          ) : (
            "No Users Yet"
          )}
          </div>
  );
}

export default Handler;