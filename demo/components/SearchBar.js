import React from 'react';
import PlacesAutocomplete from '../../src';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };
    this.handleChange = address => this.setState({ address });
  }

  handleSelect = selected => {
    console.log('selected', selected); // eslint-disable-line no-console
  };

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
              <input
                {...getInputProps({
                  placeholder: 'Search Places...',
                  className: 'Demo__search-input',
                })}
              />
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
