'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expect = undefined;

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiEnzyme = require('chai-enzyme');

var _chaiEnzyme2 = _interopRequireDefault(_chaiEnzyme);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*** Set up test environment to run in a browser-like environment ***/
global.document = _jsdom2.default.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;

/*** Mock Google Maps JavaScript API ***/
var google = {
  maps: {
    places: {
      AutocompleteService: function AutocompleteService() {},
      PlacesServiceStatus: {
        OK: 'OK'
      }
    }
  }
};
global.google = google;
global.window.google = google;

_chai2.default.use((0, _chaiEnzyme2.default)());

exports.expect = _chai.expect;