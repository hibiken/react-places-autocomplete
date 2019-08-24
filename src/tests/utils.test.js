import { geocodeByAddress, geocodeByPlaceId, getLatLng } from '../utils';
import { setupGoogleMock } from './helpers/setup';
import { GEOCODE_RESULT } from './helpers/googlePayloads';

beforeAll(() => {
  setupGoogleMock();
});

describe('geocodeByAddress', () => {
  it('geocodes valid address', () => {
    expect.assertions(1);
    return geocodeByAddress('San Francisco, CA').then(results => {
      expect(results).toMatchSnapshot();
    });
  });

  it('rejects invalid address', () => {
    expect.assertions(1);
    return geocodeByAddress('someinvalidaddress').catch(error => {
      expect(error).toBeDefined();
    });
  });
});

describe('getLatLng', () => {
  describe('getting the lat and lng of a valid result', () => {
    it('resolves to the correct latLng object', () => {
      const result = GEOCODE_RESULT['San Francisco'][0]

      expect.assertions(1);
      /* lat and lng of San Francisco */
      return getLatLng(result).then(latLng => {
        expect(latLng).toEqual({
          lat: 37.7749295,
          lng: -122.41941550000001,
        });
      });
    });
  });

  describe('getting the lat and lang of an invalid result', () => {
    it('rejects the invalid result', () => {
      const result = {};

      expect.assertions(1);
      return getLatLng(result).catch(error => {
        expect(error).toBeDefined();
      });
    });
  });
});

describe('geocodeByPlaceId', () => {
  it('geocode valid placeID', () => {
    expect.assertions(1);
    /* placeID of San Francisco */
    return geocodeByPlaceId('ChIJIQBpAG2ahYAR_6128GcTUEo').then(results => {
      expect(results).toMatchSnapshot();
    });
  });
});
