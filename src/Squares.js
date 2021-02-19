import React from 'react';
import './boardc.css';

function Squares ({ value, onClick }) {
  return (<button class="xo" onClick={onClick}>
          {value}
          </button>
         );
}

export default Squares;