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