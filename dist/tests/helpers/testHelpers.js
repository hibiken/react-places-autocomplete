'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable quotes */
var mockSuggestions = exports.mockSuggestions = [{
  active: false,
  description: 'San Francisco, CA, USA',
  id: '1b9ea3c094d3ac23c9a3afa8cd4d8a41f05de50a',
  index: 0,
  placeId: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
  matchedSubstrings: [{ length: 13, offset: 0 }],
  formattedSuggestion: {
    mainText: 'San Francisco',
    secondaryText: 'CA, USA'
  },
  terms: [{ offset: 0, value: 'San Francisco' }, { offset: 15, value: 'CA' }, { offset: 19, value: 'USA' }],
  types: ['locality', 'political', 'geocode']
}, {
  active: false,
  description: 'San Francisco International Airport (SFO), San Francisco, CA, USA',
  id: '9c9fb107d7a776c3f6a26791b07982d7db079113',
  index: 1,
  placeId: 'ChIJVVVVVYx3j4ARP-3NGldc8qQ',
  matchedSubstrings: [{ length: 13, offset: 0 }],
  formattedSuggestion: {
    mainText: 'San Francisco International Airport (SFO)',
    secondaryText: 'San Francisco, CA, USA'
  },
  terms: [{ offset: 0, value: 'San Francisco International Airport (SFO)' }, { offset: 43, value: 'San Francisco' }, { offset: 58, value: 'CA' }, { offset: 62, value: 'USA' }],
  types: ['establishment']
}, {
  active: false,
  description: 'Coacalco, State of Mexico, Mexico',
  id: '33fd014a14255500805e49d7de6b7ed439d890a9',
  index: 2,
  placeId: 'ChIJmz3ukEbx0YUR_iiKUJOxHUA',
  matchedSubstrings: [{ length: 8, offset: 0 }],
  formattedSuggestion: {
    mainText: 'Coacalco',
    secondaryText: 'State of Mexico, Mexico'
  },
  terms: [{ offset: 0, value: 'Coacalco' }, { offset: 10, value: 'State of Mexico' }, { offset: 27, value: 'Mexico' }],
  types: ['locality', 'political', 'geocode']
}, {
  active: false,
  description: "San Francisco Int'l Airport Station, San Francisco, CA, USA",
  id: 'fd59fa62088bda5c2747abbae2614bd7f6525154',
  index: 3,
  placeId: 'ChIJVVVVVYx3j4ARyN7qnq2JceQ',
  matchedSubstrings: [{ length: 13, offset: 0 }],
  formattedSuggestion: {
    mainText: "San Francisco Int'l Airport Station",
    secondaryText: 'San Francisco, CA, USA'
  },
  terms: [{ offset: 0, value: "San Francisco Int'l Airport Station" }, { offset: 37, value: 'San Francisco' }, { offset: 52, value: 'CA' }, { offset: 56, value: 'USA' }],
  types: ['transit_station', 'point_of_interest', 'establishment', 'geocode']
}, {
  active: false,
  description: 'San Francisco del Rincón, Guanajuato, Mexico',
  id: 'e4007a708341192d1ddd49bce5cff3dd429e3f98',
  index: 4,
  placeId: 'ChIJ3bwFNq7DK4QR1ZorLLDndeA',
  formattedSuggestion: {
    mainText: 'San Francisco del Rincón',
    secondaryText: 'Guanajuato, Mexico'
  },
  matchedSubstrings: [{ length: 13, offset: 0 }],
  terms: [{ offset: 0, value: 'San Francisco del Rincón' }, { offset: 26, value: 'Guanajuato' }, { offset: 38, value: 'Mexico' }],
  types: ['locality', 'political', 'geocode']
}];
/**
 * Simulates User typing 'San Francisco' in input,
 * and getting results back from Google Maps API,
 * populating `suggesions` state.
 */
var simulateSearch = exports.simulateSearch = function simulateSearch(wrapper) {
  var input = wrapper.find('input');
  // simulate user typing query
  input.simulate('change', { target: { value: 'San Francisco' } });
  // simulate fetching predictions
  wrapper.setState({
    suggestions: mockSuggestions
  });
};