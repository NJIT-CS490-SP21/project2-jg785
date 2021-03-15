import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Log in button dissapears', () => {
  const result = render(<App />);
  
  const Loginbuttonelement = screen.getByText('Log in');
  expect(Loginbuttonelement).toBeInTheDocument();
  
  fireEvent.click(Loginbuttonelement);
  expect(Loginbuttonelement).not.toBeInTheDocument();
});

test('Show or hide Leaderboard', () => {
  const result = render(<App />);
  
  const LeaderboardElement = screen.getByText('Show/Hide Leaderboard');
  fireEvent.click(LeaderboardElement);
  const ScoreElement = screen.getByText('Score');
  expect(ScoreElement).toBeInTheDocument();
  
  fireEvent.click(LeaderboardElement);
  expect(ScoreElement).not.toBeInTheDocument();
  
});

test('Player X and Player O', () => {
  const result = render(<App />);
  
  const Loginbuttonelement = screen.getByText('Log in');
  fireEvent.click(Loginbuttonelement);
  
  const playerXelement = screen.getByText('Player X:');
  const playerOelement = screen.getByText('Player O has not connected yet.');
  
  expect(playerXelement).toBeInTheDocument();
  expect(playerOelement).toBeInTheDocument();
});