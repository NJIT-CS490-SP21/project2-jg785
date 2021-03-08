import React from 'react';
import io from 'socket.io-client';

//Function from reactjs.org
const socket = io(); // Connects to socket connection io()

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			//console.log("squares a", squares[a]); //prints X or O
			//console.log("player X from winner js: ", playerX);
			//console.log("player O from winner js: ", playerO);
			//if(squares[a] == "X"){
		      //socket.emit('setwinlosedraw', { winner: playerX, loser: playerO});
		    //}
		    
		    //else if(squares[a] == "O"){
		      //socket.emit('setwinlosedraw', { winner: playerO, loser: playerX});
		    //}
			
			return squares[a];
		}
	}
	return null;
}

export default calculateWinner;