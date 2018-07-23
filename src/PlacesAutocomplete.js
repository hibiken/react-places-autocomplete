/*
* Copyright (c) 2016-present, Ken Hibino.
* Licensed under the MIT License (MIT).
* See https://kenny-hibino.github.io/react-places-autocomplete
*/

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { compose } from './helpers';

// transform snake_case to camelCase
const formattedSuggestion = structured_formatting => ({
  mainText: structured_formatting.main_text,
  secondaryText: structured_formatting.secondary_text,
  mainTextMatchedSubstrings: structured_formatting.main_text_matched_substrings,
  secondaryTextMatchedSubstrings:
    structured_formatting.secondary_text_matched_substrings,
});

class PlacesAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      suggestions: [],
      userInputValue: props.value,
      ready: !props.googleCallbackName,
    };

    this.debouncedFetchPredictions = debounce(
      this.fetchPredictions,
      this.props.debounce
    );
  }

  componentDidMount() {
    const { googleCallbackName } = this.props;
    if (googleCallbackName) {
      if (!window.google) {
        window[googleCallbackName] = this.init;
      } else {
        this.init();
      }
    } else {
      this.init();
    }
  }

  componentWillUnmount() {
    const { googleCallbackName } = this.props;
    if (googleCallbackName && window[googleCallbackName]) {
      delete window[googleCallbackName];
    }
  }

  init = () => {
    if (!window.google) {
      throw new Error(
        '[react-places-autocomplete]: Google Maps JavaScript API library must be loaded. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library'
      );
    }

    if (!window.google.maps.places) {
      throw new Error(
        '[react-places-autocomplete]: Google Maps Places library must be loaded. Please add `libraries=places` to the src URL. See: https://github.com/kenny-hibino/react-places-autocomplete#load-google-library'
      );
    }

    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.autocompleteOK = window.google.maps.places.PlacesServiceStatus.OK;
    this.setState(state => {
      if (state.ready) {
        return null;
      } else {
        return { ready: true };
      }
    });
  };

  autocompleteCallback = (predictions, status) => {
    this.setState({ loading: false });
    if (status !== this.autocompleteOK) {
      this.props.onError(status, this.clearSuggestions);
      return;
    }
    const { highlightFirstSuggestion } = this.props;
    this.setState({
      suggestions: predictions.map((p, idx) => ({
        id: p.id,
        description: p.description,
        placeId: p.place_id,
        active: highlightFirstSuggestion && idx === 0 ? true : false,
        index: idx,
        formattedSuggestion: formattedSuggestion(p.structured_formatting),
        matchedSubstrings: p.matched_substrings,
        terms: p.terms,
        types: p.types,
      })),
    });
  };

  fetchPredictions = () => {
    const { value } = this.props;
    if (value.length) {
      this.setState({ loading: true });
      this.autocompleteService.getPlacePredictions(
        {
          ...this.props.searchOptions,
          input: value,
        },
        this.autocompleteCallback
      );
    }
  };

  clearSuggestions = () => {
    this.setState({ suggestions: [] });
  };

  clearActive = () => {
    this.setState({
      suggestions: this.state.suggestions.map(suggestion => ({
        ...suggestion,
        active: false,
      })),
    });
  };

  handleSelect = (address, placeId) => {
    this.clearSuggestions();
    if (this.props.onSelect) {
      this.props.onSelect(address, placeId);
    } else {
      this.props.onChange(address);
    }
  };

  getActiveSuggestion = () => {
    return this.state.suggestions.find(suggestion => suggestion.active);
  };

  selectActiveAtIndex = index => {
    const activeName = this.state.suggestions.find(
      suggestion => suggestion.index === index
    ).description;
    this.setActiveAtIndex(index);
    this.props.onChange(activeName);
  };

  selectUserInputValue = () => {
    this.clearActive();
    this.props.onChange(this.state.userInputValue);
  };

  handleEnterKey = () => {
    const activeSuggestion = this.getActiveSuggestion();
    if (activeSuggestion === undefined) {
      this.handleSelect(this.props.value, null);
    } else {
      this.handleSelect(activeSuggestion.description, activeSuggestion.placeId);
    }
  };

  handleDownKey = () => {
    if (this.state.suggestions.length === 0) {
      return;
    }

    const activeSuggestion = this.getActiveSuggestion();
    if (activeSuggestion === undefined) {
      this.selectActiveAtIndex(0);
    } else if (activeSuggestion.index === this.state.suggestions.length - 1) {
      this.selectUserInputValue();
    } else {
      this.selectActiveAtIndex(activeSuggestion.index + 1);
    }
  };

  handleUpKey = () => {
    if (this.state.suggestions.length === 0) {
      return;
    }

    const activeSuggestion = this.getActiveSuggestion();
    if (activeSuggestion === undefined) {
      this.selectActiveAtIndex(this.state.suggestions.length - 1);
    } else if (activeSuggestion.index === 0) {
      this.selectUserInputValue();
    } else {
      this.selectActiveAtIndex(activeSuggestion.index - 1);
    }
  };

  handleInputKeyDown = event => {
    /* eslint-disable indent */
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
        this.clearSuggestions();
        break;
    }
    /* eslint-enable indent */
  };

  setActiveAtIndex = index => {
    this.setState({
      suggestions: this.state.suggestions.map((suggestion, idx) => {
        if (idx === index) {
          return { ...suggestion, active: true };
        } else {
          return { ...suggestion, active: false };
        }
      }),
    });
  };

  handleInputChange = event => {
    const { value } = event.target;
    this.props.onChange(value);
    this.setState({ userInputValue: value });
    if (!value) {
      this.clearSuggestions();
      return;
    }
    if (this.props.shouldFetchSuggestions) {
      this.debouncedFetchPredictions();
    }
  };

  handleInputOnBlur = () => {
    if (!this.mousedownOnSuggestion) {
      this.clearSuggestions();
    }
  };

  getActiveSuggestionId = () => {
    const activeSuggestion = this.getActiveSuggestion();
    return activeSuggestion
      ? `PlacesAutocomplete__suggestion-${activeSuggestion.placeId}`
      : null;
  };

  getIsExpanded = () => {
    return this.state.suggestions.length > 0;
  };

  getInputProps = (options = {}) => {
    if (options.hasOwnProperty('value')) {
      throw new Error(
        '[react-places-autocomplete]: getInputProps does not accept `value`. Use `value` prop instead'
      );
    }

    if (options.hasOwnProperty('onChange')) {
      throw new Error(
        '[react-places-autocomplete]: getInputProps does not accept `onChange`. Use `onChange` prop instead'
      );
    }

    const defaultInputProps = {
      type: 'text',
      autoComplete: 'off',
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': this.getIsExpanded(),
      'aria-activedescendant': this.getActiveSuggestionId(),
      disabled: !this.state.ready,
    };

    return {
      ...defaultInputProps,
      ...options,
      onKeyDown: compose(this.handleInputKeyDown, options.onKeyDown),
      onBlur: compose(this.handleInputOnBlur, options.onBlur),
      value: this.props.value,
      onChange: event => {
        this.handleInputChange(event);
      },
    };
  };

  getSuggestionItemProps = (suggestion, options = {}) => {
    const handleSuggestionMouseEnter = this.handleSuggestionMouseEnter.bind(
      this,
      suggestion.index
    );
    const handleSuggestionClick = this.handleSuggestionClick.bind(
      this,
      suggestion
    );

    return {
      ...options,
      key: suggestion.id,
      id: this.getActiveSuggestionId(),
      role: 'option',
      onMouseEnter: compose(handleSuggestionMouseEnter, options.onMouseEnter),
      onMouseLeave: compose(
        this.handleSuggestionMouseLeave,
        options.onMouseLeave
      ),
      onMouseDown: compose(this.handleSuggestionMouseDown, options.onMouseDown),
      onMouseUp: compose(this.handleSuggestionMouseUp, options.onMouseUp),
      onTouchStart: compose(
        this.handleSuggestionTouchStart,
        options.onTouchStart
      ),
      onTouchEnd: compose(this.handleSuggestionMouseUp, options.onTouchEnd),
      onClick: compose(handleSuggestionClick, options.onClick),
    };
  };

  handleSuggestionMouseEnter = index => {
    this.setActiveAtIndex(index);
  };

  handleSuggestionMouseLeave = () => {
    this.mousedownOnSuggestion = false;
    this.clearActive();
  };

  handleSuggestionMouseDown = event => {
    event.preventDefault();
    this.mousedownOnSuggestion = true;
  };

  handleSuggestionTouchStart = () => {
    this.mousedownOnSuggestion = true;
  };

  handleSuggestionMouseUp = () => {
    this.mousedownOnSuggestion = false;
  };

  handleSuggestionClick = (suggestion, event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const { description, placeId } = suggestion;
    this.handleSelect(description, placeId);
    setTimeout(() => {
      this.mousedownOnSuggestion = false;
    });
  };

  render() {
    return this.props.children({
      getInputProps: this.getInputProps,
      getSuggestionItemProps: this.getSuggestionItemProps,
      loading: this.state.loading,
      suggestions: this.state.suggestions,
    });
  }
}

PlacesAutocomplete.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  onError: PropTypes.func,
  onSelect: PropTypes.func,
  searchOptions: PropTypes.shape({
    bounds: PropTypes.object,
    componentRestrictions: PropTypes.object,
    location: PropTypes.object,
    offset: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    types: PropTypes.array,
  }),
  debounce: PropTypes.number,
  highlightFirstSuggestion: PropTypes.bool,
  shouldFetchSuggestions: PropTypes.bool,
  googleCallbackName: PropTypes.string,
};

PlacesAutocomplete.defaultProps = {
  /* eslint-disable no-unused-vars, no-console */
  onError: (status, _clearSuggestions) =>
    console.error(
      '[react-places-autocomplete]: error happened when fetching data from Google Maps API.\nPlease check the docs here (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)\nStatus: ',
      status
    ),
  /* eslint-enable no-unused-vars, no-console */
  searchOptions: {},
  debounce: 200,
  highlightFirstSuggestion: false,
  shouldFetchSuggestions: true,
};

export default PlacesAutocomplete;
