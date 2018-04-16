import { geocodeByAddress, geocodeByPlaceId } from '../utils';
import { setupGoogleMock } from './helpers/setup';

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

describe('geocodeByPlaceId', () => {
  it('geocode valid placeID', () => {
    expect.assertions(1);
    /* placeID of San Francisco */
    return geocodeByPlaceId('ChIJIQBpAG2ahYAR_6128GcTUEo').then(results => {
      expect(results).toMatchSnapshot();
    });
  });
});

/* TODO: test getLatLng */
