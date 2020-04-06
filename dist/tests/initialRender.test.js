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

test('initial render', function () {
  var state = {
    address: ''
  };
  var onChangeFunc = function onChangeFunc(newAddress) {
    state = { address: newAddress }; // reassian new object to state
  };

  var component = (0, _enzyme.mount)(_react2.default.createElement(
    _index2.default,
    { value: state.address, onChange: onChangeFunc },
    function (_ref) {
      var getInputProps = _ref.getInputProps,
          suggestions = _ref.suggestions,
          getSuggestionItemProps = _ref.getSuggestionItemProps;
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
                getSuggestionItemProps(suggestion),
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

  expect(component).toMatchSnapshot();
});

test('initial render with options to props-getter', function () {
  var state = {
    address: ''
  };
  var onChangeFunc = function onChangeFunc(newAddress) {
    state = { address: newAddress }; // reassian new object to state
  };

  var component = (0, _enzyme.mount)(_react2.default.createElement(
    _index2.default,
    { value: state.address, onChange: onChangeFunc },
    function (_ref2) {
      var getInputProps = _ref2.getInputProps,
          suggestions = _ref2.suggestions,
          getSuggestionItemProps = _ref2.getSuggestionItemProps;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement('input', getInputProps({
          placeholder: 'Search Places...',
          className: 'my-input-classname'
        })),
        _react2.default.createElement(
          'div',
          null,
          suggestions.map(function (suggestion) {
            return (
              /* eslint-disable react/jsx-key */
              _react2.default.createElement(
                'div',
                getSuggestionItemProps(suggestion, {
                  className: 'my-suggestion-item-className'
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

  expect(component).toMatchSnapshot();
});

test('initial render with initial input value', function () {
  var state = {
    address: 'San Francisco, CA'
  };
  var onChangeFunc = function onChangeFunc(newAddress) {
    state = { address: newAddress }; // reassian new object to state
  };

  var component = (0, _enzyme.mount)(_react2.default.createElement(
    _index2.default,
    { value: state.address, onChange: onChangeFunc },
    function (_ref3) {
      var getInputProps = _ref3.getInputProps,
          suggestions = _ref3.suggestions,
          getSuggestionItemProps = _ref3.getSuggestionItemProps;
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
                getSuggestionItemProps(suggestion),
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

  expect(component).toMatchSnapshot();
});