'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mountComponent = exports.setupGoogleMock = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _ = require('../..');

var _2 = _interopRequireDefault(_);

var _googlePayloads = require('./googlePayloads');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GeocoderMock = function () {
  function GeocoderMock() {
    _classCallCheck(this, GeocoderMock);
  }

  _createClass(GeocoderMock, [{
    key: 'geocode',
    value: function geocode(_ref, callback) {
      var address = _ref.address,
          placeId = _ref.placeId;

      if (address) {
        this._geocodeAddress(address, callback);
      } else if (placeId) {
        this._geocodePlaceID(placeId, callback);
      } else {
        callback({}, 'ZERO_RESULTS');
      }
    }
  }, {
    key: '_geocodeAddress',
    value: function _geocodeAddress(address, callback) {
      if (address.startsWith('San Francisco')) {
        callback(_googlePayloads.GEOCODE_RESULT['San Francisco'], 'OK');
      } else {
        callback([], 'ZERO_RESULTS');
      }
    }
  }, {
    key: '_geocodePlaceID',
    value: function _geocodePlaceID(placeId, callback) {
      if (placeId === 'ChIJIQBpAG2ahYAR_6128GcTUEo') {
        callback(_googlePayloads.GEOCODE_RESULT['San Francisco'], 'OK');
      } else {
        callback([], 'ZERO_RESULTS');
      }
    }
  }]);

  return GeocoderMock;
}();

var AutocompleteServiceMock = function () {
  function AutocompleteServiceMock() {
    _classCallCheck(this, AutocompleteServiceMock);
  }

  _createClass(AutocompleteServiceMock, [{
    key: 'getPlacePredictions',
    value: function getPlacePredictions(_filters, callback) {
      callback([], 'OK');
    }
  }]);

  return AutocompleteServiceMock;
}();

var setupGoogleMock = exports.setupGoogleMock = function setupGoogleMock() {
  /*** Mock Google Maps JavaScript API ***/
  var google = {
    maps: {
      places: {
        AutocompleteService: AutocompleteServiceMock,
        PlacesServiceStatus: {
          INVALID_REQUEST: 'INVALID_REQUEST',
          NOT_FOUND: 'NOT_FOUND',
          OK: 'OK',
          OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
          REQUEST_DENIED: 'REQUEST_DENIED',
          UNKNOWN_ERROR: 'UNKNOWN_ERROR',
          ZERO_RESULTS: 'ZERO_RESULTS'
        }
      },
      Geocoder: GeocoderMock,
      GeocoderStatus: {
        ERROR: 'ERROR',
        INVALID_REQUEST: 'INVALID_REQUEST',
        OK: 'OK',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        ZERO_RESULTS: 'ZERO_RESULTS'
      }
    }
  };
  global.window.google = google;
};

var DEFAULT_PROPS = {
  value: '',
  onChange: function onChange() {},
  onSelect: function onSelect() {},
  debounce: 200,
  highlightFirstSuggestion: false,
  shouldFetchSuggestions: true
};

var mountComponent = exports.mountComponent = function mountComponent() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _props = _extends({}, DEFAULT_PROPS, props);
  var wrapper = (0, _enzyme.mount)(_react2.default.createElement(
    _2.default,
    _props,
    function (_ref2) {
      var getInputProps = _ref2.getInputProps,
          suggestions = _ref2.suggestions,
          getSuggestionItemProps = _ref2.getSuggestionItemProps;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('input', getInputProps()),
        _react2.default.createElement(
          'div',
          null,
          suggestions.map(function (suggestion) {
            return (
              /* eslint-disable react/jsx-key */
              _react2.default.createElement(
                'div',
                getSuggestionItemProps(suggestion, {
                  'data-test': 'suggestion-item'
                }),
                _react2.default.createElement(
                  'span',
                  null,
                  suggestion.description
                )
              )
            );
          }
          /* eslint-enable react/jsx-key */
          )
        )
      );
    }
  ));
  return wrapper;
};