import React from 'react';
import PlacesAutocomplete from '../index';
import renderer from 'react-test-renderer';

// TODO: Move this setup code to a separate file
/*** Mock Google Maps JavaScript API ***/
const google = {
  maps: {
    places: {
      AutocompleteService: () => {},
      PlacesServiceStatus: {
        OK: 'OK',
      },
    },
  },
};
global.window.google = google;

test('smoke test', () => {
  console.log(typeof global.window !== "undefined" ? "global.window is defined" : "No window");
  console.log(global.window.google);
  expect(true).toBe(true);
})

test('smoke test', () => {
  let state = {
    address: '',
  };
  const onChangeFunc = (newAddress) => {
    state = { address: newAddress }; // reassian new object to state
  }

  const component = renderer.create(
    <PlacesAutocomplete
      value={state.address}
      onChange={onChangeFunc}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps }) => (
        <div>
          <input {...getInputProps()} />
          <div>
            {suggestions.map(
              suggestion => (
                /* eslint-disable react/jsx-key */
                <div
                  {...getSuggestionItemProps(suggestion)}
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

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
