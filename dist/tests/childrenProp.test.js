'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _setup = require('./helpers/setup');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

test('children prop gets called once on initial render', function () {
  var childrenProp = jest.fn().mockReturnValue(null);

  _reactTestRenderer2.default.create(_react2.default.createElement(
    _index2.default,
    { value: '', onChange: function onChange() {} },
    childrenProp
  ));

  expect(childrenProp.mock.calls.length).toBe(1);
});