/*
* Copyright (c) 2017 Ken Hibino.
* Licensed under the MIT License (MIT).
* See https://kenny-hibino.github.io/react-places-autocomplete
*/

import React from 'react'
import defaultStyles from './defaultStyles'

class PlacesAutocomplete extends React.Component {
  constructor(props) {
    super(props)

    this.state = { autocompleteItems: [] }

    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.currentValue = ''
    this.showSoftComplete = true
  }

  componentDidMount() {
    this.autocompleteService = new google.maps.places.AutocompleteService()
    this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK
  }

  autocompleteCallback(predictions, status) {
    if (status != this.autocompleteOK) {
      this.props.onError(status)
      if (this.props.clearItemsOnError) { this.clearAutocomplete() }
      return
    }

    this.setState({
      autocompleteItems: predictions.map((p, idx) => ({
        suggestion: p.description,
        placeId: p.place_id,
        active: false,
        index: idx,
        formattedSuggestion: this._formattedSuggestion(p.structured_formatting),
      }))
    }, () => {
      if (this.showSoftComplete) {
        const firstSuggestion = this.state.autocompleteItems[0].suggestion
        const restOfSuggestion = firstSuggestion.slice(this.currentValue.length, firstSuggestion.length)

        this.refs.inputField.value += restOfSuggestion

        this.refs.inputField.setSelectionRange(this.currentValue.length, this.refs.inputField.value.length)
        this.refs.inputField.focus()
      } else {
        this.showSoftComplete = true
      }
    });
  }

  _formattedSuggestion(structured_formatting) {
    return { mainText: structured_formatting.main_text, secondaryText: structured_formatting.secondary_text }
  }

  clearAutocomplete() {
    this.setState({ autocompleteItems: [] })
  }

  selectAddress(address, placeId) {
    this.clearAutocomplete()
    this._handleSelect(address, placeId)
  }

  _handleSelect(address, placeId) {
    this.props.onSelect ? this.props.onSelect(address, placeId) : this.props.onChange(address)
  }

  _getActiveItem() {
    return this.state.autocompleteItems.find(item => item.active)
  }

  _selectActiveItemAtIndex(index) {
    const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion
    this._setActiveItemAtIndex(index)
    this.props.onChange(activeName)
  }

  _handleEnterKey() {
    const activeItem = this._getActiveItem()
    if (activeItem === undefined) {
      this._handleEnterKeyWithoutActiveItem()
    } else {
      this.selectAddress(activeItem.suggestion, activeItem.placeId)
    }
  }

  _handleEnterKeyWithoutActiveItem() {
    if (this.props.onEnterKeyDown) {
      this.props.onEnterKeyDown(this.props.value)
      this.clearAutocomplete()
    } else if (this.showSoftComplete) {
      const suggestedPlace = this.state.autocompleteItems[0]
      this.selectAddress(suggestedPlace.suggestion, suggestedPlace.placeId)
    } else {
      return //noop
    }
  }

  _handleDownKey() {
    const activeItem = this._getActiveItem()
    if (activeItem === undefined) {
      this._selectActiveItemAtIndex(0)
    } else {
      const nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length
      this._selectActiveItemAtIndex(nextIndex)
    }
  }

  _handleUpKey() {
    const activeItem = this._getActiveItem()
    if (activeItem === undefined) {
      this._selectActiveItemAtIndex(this.state.autocompleteItems.length - 1)
    } else {
      let prevIndex
      if (activeItem.index === 0) {
        prevIndex = this.state.autocompleteItems.length - 1
      } else {
        prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length
      }
      this._selectActiveItemAtIndex(prevIndex)
    }
  }

  _handleDeleteKey() {
    this.showSoftComplete = false
  }

  handleInputKeyDown(event) {
    const ARROW_UP = 38
    const ARROW_DOWN = 40
    const ENTER_KEY = 13
    const ESC_KEY = 27
    const DELETE_KEY = 8

    switch (event.keyCode) {
      case ENTER_KEY:
        event.preventDefault()
        this._handleEnterKey()
        break
      case ARROW_DOWN:
        this._handleDownKey()
        break
      case ARROW_UP:
        this._handleUpKey()
        break
      case ESC_KEY:
        this.clearAutocomplete()
        break
      case DELETE_KEY:
        this._handleDeleteKey()
    }
  }

  _setActiveItemAtIndex(index) {
    this.setState({
      autocompleteItems: this.state.autocompleteItems.map((item, idx) => {
        if (idx === index) {
          return { ...item, active: true }
        } else {
          return { ...item, active: false }
        }
      }),
    })
  }

  handleInputChange(event) {
    this.props.onChange(event.target.value)
    if (!event.target.value) {
      this.clearAutocomplete()
      return
    }
    this.autocompleteService.getPlacePredictions({ ...this.props.options, input: event.target.value }, this.autocompleteCallback)

    this.currentValue = event.target.value
  }

  autocompleteItemStyle(active) {
    if (active) {
      return { ...defaultStyles.autocompleteItemActive, ...this.props.styles.autocompleteItemActive }
    } else {
      return {}
    }
  }

  renderAutocomplete() {
    const { autocompleteItems } = this.state
    const { styles } = this.props
    if (autocompleteItems.length === 0) { return null }
    return (
      <div
        id="PlacesAutocomplete__autocomplete-container"
        className={this.props.classNames.autocompleteContainer || ''}
        style={{ ...defaultStyles.autocompleteContainer, ...styles.autocompleteContainer }}>
        {autocompleteItems.map((p, idx) => (
          <div
            key={p.placeId}
            onMouseOver={() => this._setActiveItemAtIndex(p.index)}
            onMouseDown={() => this.selectAddress(p.suggestion, p.placeId)}
            style={{ ...defaultStyles.autocompleteItem, ...styles.autocompleteItem, ...this.autocompleteItemStyle(p.active) }}>
            {this.props.autocompleteItem({ suggestion: p.suggestion, formattedSuggestion: p.formattedSuggestion })}
          </div>
        ))}
      </div>
    )
  }

  renderInput() {
    const { classNames, placeholder, styles, value, autoFocus } = this.props

    return (
      <input
        type="text"
        ref="inputField"
        placeholder={placeholder}
        className={classNames.input || ''}
        value={value}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        onBlur={() => this.clearAutocomplete()}
        style={styles.input}
        autoFocus={autoFocus}
      />
    )
  }

  render() {
    const { classNames, styles } = this.props
    return (
      <div
        style={{ ...defaultStyles.root, ...styles.root }}
        className={classNames.root || ''}>
        {this.renderInput()}
        {this.renderAutocomplete()}
      </div>
    )
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
  })
}

PlacesAutocomplete.defaultProps = {
  clearItemsOnError: false,
  onError: (status) => console.error('[react-places-autocomplete]: error happened when fetching data from Google Maps API.\nPlease check the docs here (https://developers.google.com/maps/documentation/javascript/places#place_details_responses)\nStatus: ', status),
  placeholder: 'Address',
  autoFocus: false,
  classNames: {},
  autocompleteItem: ({ suggestion }) => (<div>{suggestion}</div>),
  styles: {},
  options: {}
}

export default PlacesAutocomplete
