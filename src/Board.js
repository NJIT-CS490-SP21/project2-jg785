import React from 'react';
import Squares from './Squares';
import './boardc.css';

function Board ({ squares, onClick }) {
  return (<div className="board">
          {squares.map((square, i) => (<Squares key={i} value={square} onClick={() => onClick(i)}/>))}
          </div>
          );
}

export default Board;