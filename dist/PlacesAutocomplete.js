'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

var _defaultStyles = require('./defaultStyles');

var _defaultStyles2 = _interopRequireDefault(_defaultStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Copyright (c) 2017 Ken Hibino.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Licensed under the MIT License (MIT).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * See https://kenny-hibino.github.io/react-places-autocomplete
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var PlacesAutocomplete = function (_Component) {
  _inherits(PlacesAutocomplete, _Component);

  function PlacesAutocomplete(props) {
    _classCallCheck(this, PlacesAutocomplete);

    var _this = _possibleConstructorReturn(this, (PlacesAutocomplete.__proto__ || Object.getPrototypeOf(PlacesAutocomplete)).call(this, props));

    _this.state = { autocompleteItems: [] };

    _this.autocompleteCallback = _this.autocompleteCallback.bind(_this);
    _this.handleInputKeyDown = _this.handleInputKeyDown.bind(_this);
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.debouncedFetchPredictions = (0, _lodash2.default)(_this.fetchPredictions, _this.props.debounce);
    return _this;
  }

  _createClass(PlacesAutocomplete, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!window.google) {
        throw new Error('Google Maps JavaScript API library must be loaded. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library');
      }

      if (!window.google.maps.places) {
        throw new Error('Google Maps Places library must be loaded. Please add `libraries=places` to the src URL. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library');
      }

      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK;
    }
  }, {
    key: 'autocompleteCallback',
    value: function autocompleteCallback(predictions, status) {
      if (status != this.autocompleteOK) {
        this.props.onError(status);
        if (this.props.clearItemsOnError) {
          this.clearAutocomplete();
        }
        return;
      }

      // transform snake_case to camelCase
      var formattedSuggestion = function formattedSuggestion(structured_formatting) {
        return {
          mainText: structured_formatting.main_text,
          secondaryText: structured_formatting.secondary_text
        };
      };

      var highlightFirstSuggestion = this.props.highlightFirstSuggestion;


      this.setState({
        autocompleteItems: predictions.map(function (p, idx) {
          return {
            suggestion: p.description,
            placeId: p.place_id,
            active: highlightFirstSuggestion && idx === 0 ? true : false,
            index: idx,
            formattedSuggestion: formattedSuggestion(p.structured_formatting)
          };
        })
      });
    }
  }, {
    key: 'fetchPredictions',
    value: function fetchPredictions() {
      var value = this.props.inputProps.value;

      if (value.length) {
        this.autocompleteService.getPlacePredictions(_extends({}, this.props.options, {
          input: value
        }), this.autocompleteCallback);
      }
    }
  }, {
    key: 'clearAutocomplete',
    value: function clearAutocomplete() {
      this.setState({ autocompleteItems: [] });
    }
  }, {
    key: 'selectAddress',
    value: function selectAddress(address, placeId) {
      this.clearAutocomplete();
      this.handleSelect(address, placeId);
    }
  }, {
    key: 'handleSelect',
    value: function handleSelect(address, placeId) {
      this.props.onSelect ? this.props.onSelect(address, placeId) : this.props.inputProps.onChange(address);
    }
  }, {
    key: 'getActiveItem',
    value: function getActiveItem() {
      return this.state.autocompleteItems.find(function (item) {
        return item.active;
      });
    }
  }, {
    key: 'selectActiveItemAtIndex',
    value: function selectActiveItemAtIndex(index) {
      var activeName = this.state.autocompleteItems.find(function (item) {
        return item.index === index;
      }).suggestion;
      this.setActiveItemAtIndex(index);
      this.props.inputProps.onChange(activeName);
    }
  }, {
    key: 'handleEnterKey',
    value: function handleEnterKey() {
      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.handleEnterKeyWithoutActiveItem();
      } else {
        this.selectAddress(activeItem.suggestion, activeItem.placeId);
      }
    }
  }, {
    key: 'handleEnterKeyWithoutActiveItem',
    value: function handleEnterKeyWithoutActiveItem() {
      if (this.props.onEnterKeyDown) {
        this.props.onEnterKeyDown(this.props.inputProps.value);
        this.clearAutocomplete();
        this.debouncedFetchPredictions.cancel();
      } else {
        return; //noop
      }
    }
  }, {
    key: 'handleDownKey',
    value: function handleDownKey() {
      if (this.state.autocompleteItems.length === 0) {
        return;
      }

      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.selectActiveItemAtIndex(0);
      } else {
        var nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length;
        this.selectActiveItemAtIndex(nextIndex);
      }
    }
  }, {
    key: 'handleUpKey',
    value: function handleUpKey() {
      if (this.state.autocompleteItems.length === 0) {
        return;
      }

      var activeItem = this.getActiveItem();
      if (activeItem === undefined) {
        this.selectActiveItemAtIndex(this.state.autocompleteItems.length - 1);
      } else {
        var prevIndex = void 0;
        if (activeItem.index === 0) {
          prevIndex = this.state.autocompleteItems.length - 1;
        } else {
          prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length;
        }
        this.selectActiveItemAtIndex(prevIndex);
      }
    }
  }, {
    key: 'handleInputKeyDown',
    value: function handleInputKeyDown(event) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          this.handleEnterKey();
          break;
        case 'ArrowDown':
          event.preventDefault(); // prevent the cursor from moving
          this.handleDownKey();
          break;
        case 'ArrowUp':
          event.preventDefault(); // prevent the cursor from moving
          this.handleUpKey();
          break;
        case 'Escape':
          this.clearAutocomplete();
          break;
      }

      if (this.props.inputProps.onKeyDown) {
        this.props.inputProps.onKeyDown(event);
      }
    }
  }, {
    key: 'setActiveItemAtIndex',
    value: function setActiveItemAtIndex(index) {
      this.setState({
        autocompleteItems: this.state.autocompleteItems.map(function (item, idx) {
          if (idx === index) {
            return _extends({}, item, { active: true });
          } else {
            return _extends({}, item, { active: false });
          }
        })
      });
    }
  }, {
    key: 'handleInputChange',
    value: function handleInputChange(event) {
      this.props.inputProps.onChange(event.target.value);
      if (!event.target.value) {
        this.clearAutocomplete();
        return;
      }
      this.debouncedFetchPredictions();
    }
  }, {
    key: 'handleInputOnBlur',
    value: function handleInputOnBlur(event) {
      this.clearAutocomplete();

      if (this.props.inputProps.onBlur) {
        this.props.inputProps.onBlur(event);
      }
    }
  }, {
    key: 'inlineStyleFor',
    value: function inlineStyleFor() {
      var _props = this.props,
          classNames = _props.classNames,
          styles = _props.styles;
      // No inline style if className is passed via props for the element.

      for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      if (props.some(function (prop) {
        return classNames.hasOwnProperty(prop);
      })) {
        return {};
      }

      return props.reduce(function (acc, prop) {
        return _extends({}, acc, _defaultStyles2.default[prop], styles[prop]);
      }, {});
    }
  }, {
    key: 'classNameFor',
    value: function classNameFor() {
      var classNames = this.props.classNames;

      for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        props[_key2] = arguments[_key2];
      }

      return props.reduce(function (acc, prop) {
        var name = classNames[prop] || '';
        return name ? acc + ' ' + name : acc;
      }, '');
    }
  }, {
    key: 'getInputProps',
    value: function getInputProps() {
      var _this2 = this;

      var defaultInputProps = {
        type: "text"
      };

      return _extends({}, defaultInputProps, this.props.inputProps, {
        onChange: function onChange(event) {
          _this2.handleInputChange(event);
        },
        onKeyDown: function onKeyDown(event) {
          _this2.handleInputKeyDown(event);
        },
        onBlur: function onBlur(event) {
          _this2.handleInputOnBlur(event);
        },
        style: this.inlineStyleFor('input'),
        className: this.classNameFor('input')
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          classNames = _props2.classNames,
          styles = _props2.styles;
      var autocompleteItems = this.state.autocompleteItems;

      var inputProps = this.getInputProps();

      return _react2.default.createElement(
        'div',
        {
          id: 'PlacesAutocomplete__root',
          style: this.inlineStyleFor('root'),
          className: this.classNameFor('root') },
        _react2.default.createElement('input', inputProps),
        autocompleteItems.length > 0 && _react2.default.createElement(
          'div',
          {
            id: 'PlacesAutocomplete__autocomplete-container',
            style: this.inlineStyleFor('autocompleteContainer'),
            className: this.classNameFor('autocompleteContainer') },
          autocompleteItems.map(function (p, idx) {
            return _react2.default.createElement(
              'div',
              {
                key: p.placeId,
                onMouseOver: function onMouseOver() {
                  return _this3.setActiveItemAtIndex(p.index);
                },
                onMouseDown: function onMouseDown() {
                  return _this3.selectAddress(p.suggestion, p.placeId);
                },
                style: p.active ? _this3.inlineStyleFor('autocompleteItem', 'autocompleteItemActive') : _this3.inlineStyleFor('autocompleteItem'),
                className: p.active ? _this3.classNameFor('autocompleteItem', 'autocompleteItemActive') : _this3.classNameFor('autocompleteItem') },
              _this3.props.autocompleteItem({ suggestion: p.suggestion, formattedSuggestion: p.formattedSuggestion })
            );
          })
        )
      );
    }
  }]);

  return PlacesAutocomplete;
}(_react.Component);

PlacesAutocomplete.propTypes = {
  inputProps: function inputProps(props, propName) {
    var inputProps = props[propName];

    if (!inputProps.hasOwnProperty('value')) {
      throw new Error('\'inputProps\' must have \'value\'.');
    }

    if (!inputProps.hasOwnProperty('onChange')) {
      throw new Error('\'inputProps\' must have \'onChange\'.');
    }
  },
  onError: _propTypes2.default.func,
  clearItemsOnError: _propTypes2.default.bool,
  onSelect: _propTypes2.default.func,
  autocompleteItem: _propTypes2.default.func,
  classNames: _propTypes2.default.shape({
    root: _propTypes2.default.string,
    input: _propTypes2.default.string,
    autocompleteContainer: _propTypes2.default.string,
    autocompleteItem: _propTypes2.default.string,
    autocompleteItemActive: _propTypes2.default.string
  }),
  styles: _propTypes2.default.shape({
    root: _propTypes2.default.object,
    input: _propTypes2.default.object,
    autocompleteContainer: _propTypes2.default.object,
    autocompleteItem: _propTypes2.default.object,
    autocompleteItemActive: _propTypes2.default.object
  }),
  options: _propTypes2.default.shape({
    bounds: _propTypes2.default.object,
    componentRestrictions: _propTypes2.default.object,
    location: _propTypes2.default.object,
    offset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    radius: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]),
    types: _propTypes2.default.array
  }),
  debounce: _propTypes2.default.number,
  highlightFirstSuggestion: _propTypes2.default.bool
};

PlacesAutocomplete.defaultProps = {
  clearItemsOnError: false,
  onError: function onError(status) {
    return console.error('[react-places-autocomplete]: error happened when fetching data from Google Maps API.\nPlease check the docs here (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)\nStatus: ', status);
  },
  classNames: {},
  autocompleteItem: function autocompleteItem(_ref) {
    var suggestion = _ref.suggestion;
    return _react2.default.createElement(
      'div',
      null,
      suggestion
    );
  },
  styles: {},
  options: {},
  debounce: 200,
  highlightFirstSuggestion: false
};

exports.default = PlacesAutocomplete;