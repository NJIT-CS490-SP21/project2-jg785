import React from 'react';
import Squares from './Squares';
import './boardc.css';

const style = {
    border: '4px solid orange',
    borderRadius: '10px',
    width: '400px',
    height: '400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)'
};

function Board ({ squares, onClick }) {
  return (<div style={style}>
          {squares.map((square, i) => (<Squares key={i} value={square} onClick={() => onClick(i)}/>))}
          </div>
          );
}

export default Board;