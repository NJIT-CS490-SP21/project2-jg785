import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Log in button dissapears', () => {
  const result = render(<App />);
  
  const Loginbuttonelement = screen.getByText('Log in');
  expect(Loginbuttonelement).toBeInTheDocument();
  
  fireEvent.click(Loginbuttonelement);
  expect(Loginbuttonelement).not.toBeInTheDocument();
});