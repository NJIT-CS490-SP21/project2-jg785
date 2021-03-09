import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Board from './Board';
import calculateWinner from './winner';
import io from 'socket.io-client';
import ParticlesBg from 'particles-bg';
import './boardc.css';
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
  
  //login state
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [isShown, setShown] = useState(false);
  
  const playerX = userList[0];
  const playerO = userList[1];
  const winner = calculateWinner(board);
  
  //current user state
  const [currUser, setcurrUser] = useState();
  
  //spectator state
  const [spectatorList, setSpectatorList] = useState([]);
  
  //table shown
  const [tableShown, settableShown] = useState(false);
  
  //Leaderboard state
  const [usersLeaderboard, setusersLeaderboard] = useState([]);
  const [scoresLeaderboard, setscoresLeaderboard] = useState([]);
  
  React.useEffect(() => {
    if(winner == "X" && currUser == playerX){
      socket.emit('setwinlosedraw', { winner: playerX, loser: playerO});
    }
    
    else if(winner == "O" && currUser == playerO){
      socket.emit('setwinlosedraw', { winner: playerO, loser: playerX});
    }
    
  }, [winner]);
  
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
    
    if(usersLeaderboard.includes(username) == false){
      setusersLeaderboard(prevList => [...prevList, username]);
      setscoresLeaderboard(prevList => [...prevList, 100]);
    }
    
    socket.emit('login', { username: username });
    
    //Will make input box empty after user logs in
    inputRef.current.value = "";
  }
  
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
  
  //Leaderboard
  function leaderboard(){
    
    const table = usersLeaderboard.map((value, index) => {
      const content = scoresLeaderboard[index];
      return(
        <tr>
          { ( (currUser === value) ) ? (
            <td><p><font color="blue">{value}</font></p></td>
          ) : ( <td>{value}</td>)}
          <td>{content}</td>
        </tr>
      );
    });
    
    return (
            <table>
                <thead>
                    <tr>
                        <th colSpan="2">Tic Tac Toe Leaderboard</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>Score</td>
                    </tr>
                    <tr>
                      {table}
                    </tr>
                </tbody>
            </table>
    );
  }
  
  //Restart the Game
  function renderMoves () {
    //setWinnerLoserDraw();
      return( <button onClick={() => {
                        set_board(Array(9).fill(null));
                        set_x_next(true);
                        setUserList(Array().fill(null));
                        setcurrUser((prevcurrUser)=>null);
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
    socket.on('first_list', (data) => {
      console.log('First DB event received!');
      console.log("Scores :", data);
      
      setusersLeaderboard(data["dbusers"]);
      setscoresLeaderboard(data["dbscores"]);
    });
    
    socket.on('login', (data) => {
      console.log('boardUser list received!');
      console.log("boardusers: ", data["boardUsers"]);
      console.log("dbUsers: ", data["dbUsers"]);
      console.log("dbScores: ", data["dbScores"]);
      
      var lastuser = data["boardUsers"][data["boardUsers"].length-1];
      setUserList(prevUserList => [...prevUserList, lastuser]);
      
      if(data["boardUsers"].length > 2){
        setSpectatorList(prevUserList => [...prevUserList, lastuser]);
      }
      
      //Update state vars with database data.
      setusersLeaderboard(data["dbUsers"]);
      setscoresLeaderboard(data["dbScores"]);
      
    });
    
    socket.on('board', (data) => {
      console.log('Board event received!');
      console.log(data);
      
      set_x_next(!data.isXNext);
      set_board((prevBoard) => [...data.squares]);
      
    });
    
    socket.on('new_scores', (data) => {
      console.log('New Scores event received!');
      console.log('endGameUsers', data["endGameUsers"]);
      console.log("endGameScores:", data["endGameScores"]);
      
      setusersLeaderboard(data["endGameUsers"]);
      setscoresLeaderboard(data["endGameScores"]);
      
    });
    
    socket.on('reset_game', (data) => {
      console.log("data", data);
      
      set_board(prevBoard => data);
      set_x_next(true);
      setUserList(Array().fill(null));
      setcurrUser((prevcurrUser)=>null);
      setSpectatorList(Array().fill(null));
      setShown(false);
      settableShown(false);
      
    });
    
  }, []);
  
  //Check if board is full
  const board_is_full = board.every(element => element !== null);
  console.log(board_is_full);
  
  return (
          <div>
          <div class="display">
          <ParticlesBg type="circle" bg={true} />
          <h1>Play Tic Tac Toe, Enjoy!</h1>
          </div>
          <div class="leaderboard">
            <div class="buttonClass">
              <button onClick={() => onShowHideLeaderBoard()}>Show/Hide Leaderboard</button>
              {tableShown === true ? (
                leaderboard()
              ): ("")}
            </div>
          </div>
          <h2><div class="display">
          {isShown === false ? (
          <div>
            <input ref={inputRef} type="text" />
            <div class="buttonClass">
              <button onClick={() => onClickAddtoList()}>Log in</button>
            </div>
          </div>
          ) : ("")}
          {isShown === true ? (
            <div>
              <Board squares={board} onClick={clickHandler} />
              <div>
                <p>Player X: {playerX}</p>
                <p>{playerO ? "Player O: " + playerO : "Player O hasn't connected yet."}</p>
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
          </div></h2>
          </div>
  );
}

export default Handler;