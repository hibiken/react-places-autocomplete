'use strict';

var _utils = require('../utils');

var _setup = require('./helpers/setup');

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

describe('geocodeByAddress', function () {
  it('geocodes valid address', function () {
    expect.assertions(1);
    return (0, _utils.geocodeByAddress)('San Francisco, CA').then(function (results) {
      expect(results).toMatchSnapshot();
    });
  });

  it('rejects invalid address', function () {
    expect.assertions(1);
    return (0, _utils.geocodeByAddress)('someinvalidaddress').catch(function (error) {
      expect(error).toBeDefined();
    });
  });
});

describe('geocodeByPlaceId', function () {
  it('geocode valid placeID', function () {
    expect.assertions(1);
    /* placeID of San Francisco */
    return (0, _utils.geocodeByPlaceId)('ChIJIQBpAG2ahYAR_6128GcTUEo').then(function (results) {
      expect(results).toMatchSnapshot();
    });
  });
});

/* TODO: test getLatLng */