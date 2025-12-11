import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SOLCial app', () => {
  render(<App />);
  // Verifica se o heading principal da homepage está presente
  const headingElement = screen.getByText(/Descubra o potencial solar/i);
  expect(headingElement).toBeInTheDocument();
});
