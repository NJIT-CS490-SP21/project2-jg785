import React, { useRef, useState, useEffect } from 'react';

import io from 'socket.io-client';
import ParticlesBg from 'particles-bg';
import Board from './Board';
import calculateWinner from './winner';
import './boardc.css';

const socket = io(); // Connects to socket connection io()

// use <func name /> to call func in app.js
function Handler() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [XNext, setXNext] = useState(true);

  // login state
  const inputRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const [isShown, setShown] = useState(false);

  const playerX = userList[0];
  const playerO = userList[1];
  const winner = calculateWinner(board);

  // current user state
  const [currUser, setcurrUser] = useState();

  // spectator state
  const [spectatorList, setSpectatorList] = useState([]);

  // table shown
  const [tableShown, settableShown] = useState(false);

  // Leaderboard state
  const [usersLeaderboard, setusersLeaderboard] = useState([]);
  const [scoresLeaderboard, setscoresLeaderboard] = useState([]);

  React.useEffect(() => {
    if (winner === 'X' && currUser === playerX) {
      socket.emit('setwinlosedraw', { winner: playerX, loser: playerO });
    } else if (winner === 'O' && currUser === playerO) {
      socket.emit('setwinlosedraw', { winner: playerO, loser: playerX });
    }
  }, [winner]);

  function onClickAddtoList() {
    const username = inputRef.current.value;
    if (username === '') {
      // eslint-disable-next-line
      alert('Enter a valid name.');
      return;
    } if (username !== null) {
      setShown((prevShown) => !prevShown);
    }

    setcurrUser(username);
    // console.log('currUser from login func: ', currUser);

    setUserList((prevList) => [...prevList, username]);
    // console.log(userList);

    if (userList.length >= 2) {
      setSpectatorList((prevUserList) => [...prevUserList, username]);
    }

    if (usersLeaderboard.includes(username) === false) {
      setusersLeaderboard((prevList) => [...prevList, username]);
      setscoresLeaderboard((prevList) => [...prevList, 100]);
    }

    socket.emit('login', { username });

    // Will make input box empty after user logs in
    inputRef.current.value = '';
  }

  // Show/hide Leaderboard
  function onShowHideLeaderBoard() {
    settableShown((prevShown) => !prevShown);
  }

  function clickHandler(i) {
    const boardCopy = [...board];
    // If user click an occupied square or if game is won, return
    if (winner || boardCopy[i]) return;
    // Put an X or an O in the clicked square

    // Only allow first and second user to play. Other players that login,
    // are spectators.
    if (currUser === playerX || currUser === playerO) {
      boardCopy[i] = XNext ? 'X' : 'O';
      setBoard(boardCopy);
      setXNext(!XNext);

      // console.log('current user from click handler:', currUser);
      // console.log('player x and o', playerX, playerO);
      // console.log('spectator list:', spectatorList);

      // console.log(currUser);
      socket.emit('board', { squares: boardCopy, isXNext: XNext });
    }
  }

  // Leaderboard
  function leaderboard() {
    const table = usersLeaderboard.map((value, index) => {
      const content = scoresLeaderboard[index];
      return (
        <tr>
          {currUser === value ? (
            <td>
              <p>
                <font color="blue">{value}</font>
              </p>
            </td>
          ) : (
            <td>{value}</td>
          )}
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
          <tr>{table}</tr>
        </tbody>
      </table>
    );
  }

  // Restart the Game
  function renderMoves() {
    return (
      <button
        type="button"
        onClick={() => {
          setBoard(Array(9).fill(null));
          setXNext(true);
          setUserList([]);
          setcurrUser(null);
          setSpectatorList([]);
          setShown(false);
          settableShown(false);

          socket.emit('reset_game', Array(9).fill(null));
        }}
      >
        Play Again!
      </button>
    );
  }

  useEffect(() => {
    socket.on('first_list', (data) => {
      // console.log('First DB event received!');
      // console.log('Scores :', data);

      setusersLeaderboard(data.dbusers);
      setscoresLeaderboard(data.dbscores);
    });

    socket.on('login', (data) => {
      // console.log('boardUser list received!');
      // console.log('boardusers: ', data.boardUsers);
      // console.log('dbUsers: ', data.dbUsers);
      // console.log('dbScores: ', data.dbScores);

      const lastuser = data.boardUsers[data.boardUsers.length - 1];
      setUserList((prevUserList) => [...prevUserList, lastuser]);

      if (data.boardUsers.length > 2) {
        setSpectatorList((prevUserList) => [...prevUserList, lastuser]);
      }

      // Update state vars with database data.
      setusersLeaderboard(data.dbUsers);
      setscoresLeaderboard(data.dbScores);
    });

    socket.on('board', (data) => {
      // console.log('Board event received!');
      // console.log(data);

      setXNext(!data.isXNext);
      setBoard(data.squares);
    });

    socket.on('new_scores', (data) => {
      // console.log('New Scores event received!');
      // console.log('endGameUsers', data.endGameUsers);
      // console.log('endGameScores:', data.endGameScores);

      setusersLeaderboard(data.endGameUsers);
      setscoresLeaderboard(data.endGameScores);
    });

    socket.on('reset_game', (data) => {
      // console.log('data', data);

      setBoard(data);
      setXNext(true);
      setUserList([]);
      setcurrUser(null);
      setSpectatorList([]);
      setShown(false);
      settableShown(false);
    });
  }, []);

  // Check if board is full
  const boardIsFull = board.every((element) => element !== null);
  // console.log(boardIsFull);

  return (
    <div>
      <div className="display">
        <ParticlesBg type="circle" bg />
        <h1>Play Tic Tac Toe, Enjoy!</h1>
      </div>
      <div className="leaderboard">
        <div className="buttonClass">
          <button type="button" onClick={() => onShowHideLeaderBoard()}>
            Show/Hide Leaderboard
          </button>
          {tableShown === true ? leaderboard() : ''}
        </div>
      </div>
      <h2>
        <div className="display">
          {isShown === false ? (
            <div>
              <input ref={inputRef} type="text" />
              <div className="buttonClass">
                <button type="button" onClick={() => onClickAddtoList()}>Log in</button>
              </div>
            </div>
          ) : (
            ''
          )}
          {isShown === true ? (
            <div>
              <Board squares={board} onClick={clickHandler} />
              <div>
                <p>
                  Player X:
                  {playerX}
                </p>
                <p>
                  {playerO
                    ? `Player O: ${playerO}`
                    : 'Player O has not connected yet.'}
                </p>
                <p>
                  {winner
                    ? `Winner: ${winner}`
                    : `Next Player: ${XNext ? 'X' : 'O'}`}
                </p>
                {spectatorList.length !== 0 ? (
                  <div>
                    Spectators:
                    {spectatorList.map((item) => (
                      <li>{item}</li>
                    ))}
                  </div>
                ) : (
                  'No spectators have logged in yet.'
                )}
                {winner === 'X' ? (
                  <div>
                    <br />
                    {' '}
                    Winner Username:
                    {' '}
                    {playerX}
                    {' '}
                    <br />
                  </div>
                ) : (
                  ''
                )}
                {winner === 'O' ? (
                  <div>
                    <br />
                    {' '}
                    Winner Username:
                    {' '}
                    {playerO}
                    {' '}
                    <br />
                  </div>
                ) : (
                  ''
                )}

                {(winner === 'X' || winner === 'O')
                && (currUser === playerX || currUser === playerO) ? (
                  <div>{renderMoves()}</div>
                  ) : (
                    ''
                  )}
                {(winner !== 'X' || winner !== 'O') && boardIsFull ? (
                  <div>
                    <br />
                    {' '}
                    It is a draw. No winner in this match.
                    {' '}
                    <br />
                  </div>
                ) : (
                  ''
                )}
                {(winner !== 'X' || winner !== 'O')
                && (currUser === playerX || currUser === playerO)
                && boardIsFull ? (
                  <div>{renderMoves()}</div>
                  ) : (
                    ''
                  )}
              </div>
            </div>
          ) : (
            'No Users Yet'
          )}
        </div>
      </h2>
    </div>
  );
}

export default Handler;
