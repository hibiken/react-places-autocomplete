import React from 'react';
import PlacesAutocomplete, { geocodeByAddress } from '../../src';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };
    this.handleChange = address => this.setState({ address });
  }

  handleSelect = selected => {
    /* eslint-disable no-console */
    console.log('selected', selected);
    geocodeByAddress(selected)
      .then(res => console.log('res', JSON.stringify(res)))
      .catch(error => {
        console.log('error', error);
      });
    /* eslint-enable no-console */
  };

  handleCloseClick = (e) => {
    console.log(e);
    this.setState({ address: '' });
  }

  render() {
    return (
      <PlacesAutocomplete
        onChange={this.handleChange}
        value={this.state.address}
        onSelect={this.handleSelect}
        onError={() => {}}
        searchOptions={{}}
        debounce={300}
        shouldFetchSuggestions={this.state.address.length > 3}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => {
          return (
            <div>
              <div className="Demo__search-input-container">
                <input
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'Demo__search-input',
                  })}
                />
                {this.state.address.length > 0 && (
                  <button
                    className="Demo__clear-button"
                    onClick={this.handleCloseClick}
                  >x</button>
                )}
              </div>
              <div className="Demo__autocomplete-container">
                {suggestions.map(
                  suggestion => (
                    /* eslint-disable react/jsx-key */
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className: `Demo__suggestion-item${
                          suggestion.active
                            ? ' Demo__suggestion-item--active'
                            : ''
                        }`,
                      })}
                    >
                      <strong>{suggestion.formattedSuggestion.mainText}</strong>{' '}
                      <small>
                        {suggestion.formattedSuggestion.secondaryText}
                      </small>
                    </div>
                  )
                  /* eslint-enable react/jsx-key */
                )}
              </div>
            </div>
          );
        }}
      </PlacesAutocomplete>
    );
  }
}

export default SearchBar;
