import React from 'react';
import './boardc.css';

const style = {
    background: 'yellow',
    border: '2px solid darkblue',
    fontSize: '75px',
    fontWeight: '800',
    cursor: 'pointer',
    outline: 'none'
};

function Squares ({ value, onClick }) {
  return (<button style={style} onClick={onClick}>
          {value}
          </button>
         );
}

export default Squares;