/*
* Copyright (c) 2017 Ken Hibino.
* Licensed under the MIT License (MIT).
* See https://kenny-hibino.github.io/react-places-autocomplete
*/

import React from 'react'
import PlacesAutocompleteWithTypeAhead from './PlacesAutocompleteWithTypeAhead'
import PlacesAutocompleteBasic from './PlacesAutocompleteBasic'
import { mobileCheck } from './helpers'

const PlacesAutocomplete = (props) => {
  const { typeAhead, ...rest } = props
  // Work around for React KeyDown event issue: https://github.com/facebook/react/issues/6176
  const isMobile = mobileCheck()
  if (typeAhead && !isMobile) {
    return <PlacesAutocompleteWithTypeAhead {...rest} />
  } else {
    return <PlacesAutocompleteBasic {...rest} />
  }
}

PlacesAutocomplete.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onError: React.PropTypes.func,
  clearItemsOnError: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  autoFocus: React.PropTypes.bool,
  inputName: React.PropTypes.string,
  autocompleteItem: React.PropTypes.func,
  classNames: React.PropTypes.shape({
    root: React.PropTypes.string,
    input: React.PropTypes.string,
    autocompleteContainer: React.PropTypes.string,
  }),
  styles: React.PropTypes.shape({
    root: React.PropTypes.object,
    input: React.PropTypes.object,
    autocompleteContainer: React.PropTypes.object,
    autocompleteItem: React.PropTypes.object,
    autocompleteItemActive: React.PropTypes.object
  }),
  options: React.PropTypes.shape({
    bounds: React.PropTypes.object,
    componentRestrictions: React.PropTypes.object,
    location: React.PropTypes.object,
    offset: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    radius: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    types: React.PropTypes.array
  }),
  typeAhead: React.PropTypes.bool,
}

PlacesAutocomplete.defaultProps = {
  clearItemsOnError: false,
  onError: (status) => console.error('[react-places-autocomplete]: error happened when fetching data from Google Maps API.\nPlease check the docs here (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)\nStatus: ', status),
  placeholder: 'Address',
  autoFocus: false,
  classNames: {},
  autocompleteItem: ({ suggestion }) => (<div>{suggestion}</div>),
  styles: {},
  options: {},
  typeAhead: true,
}

export default PlacesAutocomplete
