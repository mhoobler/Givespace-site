import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders home', () => {
  render(<Home />);
  const header = screen.getByText(/Home/i);
  expect(header).not.toBeNull();
})

test('button hits api', () => {
  const fakeFetch = jest.fn((route: string) => {
    expect(route).toBe('/api');
    return Promise.resolve()
  });
  global.fetch = fakeFetch as any;

  render(<Home />);
  const button = screen.getByTestId('hit-api');
  button.click();
  expect(button).not.toBeNull();
  expect(fakeFetch.mock.calls.length).toBe(1);
})
