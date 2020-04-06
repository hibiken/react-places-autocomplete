'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _enzyme = require('enzyme');

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _setup = require('./helpers/setup');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

test('loading prop check', function () {
  var childProp = jest.fn();
  childProp.mockReturnValue(_react2.default.createElement(
    'div',
    null,
    _react2.default.createElement('input', null),
    'Test Render'
  ));
  var component = (0, _enzyme.mount)(_react2.default.createElement(
    _index2.default,
    {
      highlightFirstSuggestion: false,
      onChange: function onChange() {},
      onSelect: function onSelect() {},
      shouldFetchSuggestions: true,
      value: 'test'
    },
    childProp
  ));

  // simulate fetching predictions
  var el = component.find(_index2.default);
  el.instance().fetchPredictions();

  // there are 2 setStates in the callback, so we end up with 4 renders
  expect(childProp).toHaveBeenCalledTimes(4);
  var expected = [false, true, false, false];
  childProp.mock.calls.forEach(function (call, i) {
    expect(call[0]).toMatchObject({ loading: expected[i] });
  });
});