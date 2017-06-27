'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var geocodeByAddress = exports.geocodeByAddress = function geocodeByAddress(address, callback) {
  var geocoder = new google.maps.Geocoder();
  var OK = google.maps.GeocoderStatus.OK;

  return new Promise(function (resolve, reject) {
    geocoder.geocode({ address: address }, function (results, status) {
      if (status !== OK) {

        // TODO: Remove callback support in the next major version.
        if (callback) {
          console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyaddress-api"');
          callback({ status: status }, null, results);
          return;
        }

        reject(status);
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        var latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyaddress-api"');
        callback(null, latLng, results);
      }

      resolve(results);
    });
  });
};

var getLatLng = exports.getLatLng = function getLatLng(result) {
  return new Promise(function (resolve, reject) {
    try {
      var latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      };
      resolve(latLng);
    } catch (e) {
      reject(e);
    }
  });
};

var geocodeByPlaceId = exports.geocodeByPlaceId = function geocodeByPlaceId(placeId, callback) {
  var geocoder = new google.maps.Geocoder();
  var OK = google.maps.GeocoderStatus.OK;

  return new Promise(function (resolve, reject) {
    geocoder.geocode({ placeId: placeId }, function (results, status) {
      if (status !== OK) {

        // TODO: Remove callback support in the next major version.
        if (callback) {
          console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyplaceid-api"');
          callback({ status: status }, null, results);
          return;
        }

        reject(status);
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        var latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        console.warn('Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyplaceid-api"');
        callback(null, latLng, results);
      }

      resolve(results);
    });
  });
};