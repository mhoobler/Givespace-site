import React from 'react';
import {screen, render} from '@testing-library/react';
import CatalogueSelect from './CatalogueSelect';

test('it loads CatalogueSelect', () => {
  render(<CatalogueSelect/>);
  const text = screen.getByText('CatalogueSelect');

  expect(text).not.toBeNull();
})
