import React from 'react';
import { mount } from 'enzyme';
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

  const component = mount(
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

  expect(component).toMatchSnapshot();
});

test('initial render with options to props-getter', () => {
  let state = {
    address: '',
  };
  const onChangeFunc = newAddress => {
    state = { address: newAddress }; // reassian new object to state
  };

  const component = mount(
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

  expect(component).toMatchSnapshot();
});
