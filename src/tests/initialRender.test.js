import React from 'react';
import renderer from 'react-test-renderer';
import PlacesAutocomplete from '../index';
import { setupGoogleMock } from './helpers/setup';

beforeAll(() => {
  setupGoogleMock();
});

test('initial render', () => {
  let state = {
    address: '',
  };
  const onChangeFunc = newAddress => {
    state = { address: newAddress }; // reassian new object to state
  };

  const component = renderer.create(
    <PlacesAutocomplete value={state.address} onChange={onChangeFunc}>
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div>
          <input {...getInputProps()} />
          <div>
            {suggestions.map(
              suggestion => (
                /* eslint-disable react/jsx-key */
                <div {...getSuggestionItemProps(suggestion)}>
                  <span>{suggestion.description}</span>
                </div>
              )
              /* eslint-enable react/jsx-key */
            )}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('initial render with options to props-getter', () => {
  let state = {
    address: '',
  };
  const onChangeFunc = newAddress => {
    state = { address: newAddress }; // reassian new object to state
  };

  const component = renderer.create(
    <PlacesAutocomplete value={state.address} onChange={onChangeFunc}>
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Search Places...',
              className: 'my-input-classname',
            })}
          />
          <div>
            {suggestions.map(
              suggestion => (
                /* eslint-disable react/jsx-key */
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className: 'my-suggestion-item-className',
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              )
              /* eslint-enable react/jsx-key */
            )}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );

  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
