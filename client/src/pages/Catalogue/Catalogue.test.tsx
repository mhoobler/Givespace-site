import React from 'react';
import {screen, render} from '@testing-library/react';
import Catalogue from './Catalogue';

test('render catalogue',() => {
  render(<Catalogue />);
  const text = screen.getByText('Catalogue');
  expect(text).not.toBeNull();
})
