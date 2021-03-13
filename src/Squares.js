import React from 'react';
import './boardc.css';
import PropTypes from 'prop-types';

const style = {
  background: 'yellow',
  border: '2px solid darkblue',
  fontSize: '75px',
  fontWeight: '800',
  cursor: 'pointer',
  outline: 'none',
};

function Squares(props) {
  const { value, onClick } = props;
  return (
    <button type="button" style={style} onClick={onClick}>
      {value}
    </button>
  );
}

Squares.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
};

Squares.defaultProps = {
  value: '',
  onClick: null,
};

export default Squares;
