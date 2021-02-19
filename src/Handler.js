import React from 'react';
import { useState } from 'react';
import Board from './Board';

//use <func name /> to call func in app.js
function Handler () {
  const [board, set_board] = useState([Array(9).fill(null)]);
  const [index, set_index] = useState(0);
  const [x_next, set_x_next] = useState(true);
  
  function clickHandler(i) {
    const inBoard = board.slice(0, index + 1);
    const curr = inBoard[index];
    const squares = [...curr];
    
    //set letter inside button
    squares[i] = x_next ? 'X' : 'O';
    set_board([...inBoard, squares]);
    set_index(inBoard.length);
    set_x_next(!x_next);
  };
  
  return (
          <>
          <h1>Play Tic Tac Toe, Enjoy!</h1>
            <Board squares={board[index]} onClick={clickHandler} />
          </>
  );
}

export default Handler;