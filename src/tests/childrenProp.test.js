import React from 'react';
import renderer from 'react-test-renderer';
import PlacesAutocomplete from '../index';
import { setupGoogleMock } from './helpers/setup';

beforeAll(() => {
  setupGoogleMock();
});

test('children prop gets called once on initial render', () => {
  const childrenProp = jest.fn().mockReturnValue(null);

  renderer.create(
    <PlacesAutocomplete value="" onChange={() => {}}>
      {childrenProp}
    </PlacesAutocomplete>
  );

  expect(childrenProp.mock.calls.length).toBe(1);
});
