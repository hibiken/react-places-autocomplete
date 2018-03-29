import React from 'react';
import { mount } from 'enzyme';
import PlacesAutocomplete from '../..';
import { GEOCODE_RESULT } from './googlePayloads';

class GeocoderMock {
  geocode({ address, placeId }, callback) {
    if (address) {
      this._geocodeAddress(address, callback);
    } else if (placeId) {
      this._geocodePlaceID(placeId, callback);
    } else {
      callback({}, 'ZERO_RESULTS');
    }
  }

  _geocodeAddress(address, callback) {
    if (address.startsWith('San Francisco')) {
      callback(GEOCODE_RESULT['San Francisco'], 'OK');
    } else {
      callback([], 'ZERO_RESULTS');
    }
  }

  _geocodePlaceID(placeId, callback) {
    if (placeId === 'ChIJIQBpAG2ahYAR_6128GcTUEo') {
      callback(GEOCODE_RESULT['San Francisco'], 'OK');
    } else {
      callback([], 'ZERO_RESULTS');
    }
  }
}

export const setupGoogleMock = () => {
  /*** Mock Google Maps JavaScript API ***/
  const google = {
    maps: {
      places: {
        AutocompleteService: () => {},
        PlacesServiceStatus: {
          INVALID_REQUEST: 'INVALID_REQUEST',
          NOT_FOUND: 'NOT_FOUND',
          OK: 'OK',
          OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
          REQUEST_DENIED: 'REQUEST_DENIED',
          UNKNOWN_ERROR: 'UNKNOWN_ERROR',
          ZERO_RESULTS: 'ZERO_RESULTS',
        },
      },
      Geocoder: GeocoderMock,
      GeocoderStatus: {
        ERROR: 'ERROR',
        INVALID_REQUEST: 'INVALID_REQUEST',
        OK: 'OK',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        ZERO_RESULTS: 'ZERO_RESULTS',
      },
    },
  };
  global.window.google = google;
};

export const mountComponent = props => {
  const { value, onChange } = props;
  const wrapper = mount(
    <PlacesAutocomplete value={value} onChange={onChange}>
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
  return wrapper;
};
