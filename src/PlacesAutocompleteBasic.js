/*
* Copyright (c) 2017 Ken Hibino.
* Licensed under the MIT License (MIT).
* See https://kenny-hibino.github.io/react-places-autocomplete
*/

import React, { Component } from 'react'
import defaultStyles from './defaultStyles'

class PlacesAutocompleteBasic extends Component {
  constructor(props) {
    super(props)

    this.state = { autocompleteItems: [] }

    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
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
        formattedSuggestion: this.formattedSuggestion(p.structured_formatting),
      }))
    })
  }

  formattedSuggestion(structured_formatting) {
    return { mainText: structured_formatting.main_text, secondaryText: structured_formatting.secondary_text }
  }

  clearAutocomplete() {
    this.setState({ autocompleteItems: [] })
  }

  selectAddress(address, placeId) {
    this.clearAutocomplete()
    this.handleSelect(address, placeId)
  }

  handleSelect(address, placeId) {
    this.props.onSelect ? this.props.onSelect(address, placeId) : this.props.onChange(address)
  }

  getActiveItem() {
    return this.state.autocompleteItems.find(item => item.active)
  }

  selectActiveItemAtIndex(index) {
    const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion
    this.setActiveItemAtIndex(index)
    this.props.onChange(activeName)
  }

  handleEnterKey() {
    if (this.state.autocompleteItems.length === 0) {
      return
    }

    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.handleEnterKeyWithoutActiveItem()
    } else {
      this.selectAddress(activeItem.suggestion, activeItem.placeId)
    }
  }

  handleEnterKeyWithoutActiveItem() {
    if (this.props.onEnterKeyDown) {
      this.props.onEnterKeyDown(this.props.value)
      this.clearAutocomplete()
    } else {
      return //noop
    }
  }

  handleDownKey() {
    if (this.state.autocompleteItems.length === 0) {
      return
    }

    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.selectActiveItemAtIndex(0)
    } else {
      const nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length
      this.selectActiveItemAtIndex(nextIndex)
    }
  }

  handleUpKey() {
    if (this.state.autocompleteItems.length === 0) {
      return
    }

    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.selectActiveItemAtIndex(this.state.autocompleteItems.length - 1)
    } else {
      let prevIndex
      if (activeItem.index === 0) {
        prevIndex = this.state.autocompleteItems.length - 1
      } else {
        prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length
      }
      this.selectActiveItemAtIndex(prevIndex)
    }
  }

  handleInputKeyDown(event) {
    const ARROW_UP = 38
    const ARROW_DOWN = 40
    const ENTER_KEY = 13
    const ESC_KEY = 27

    switch (event.keyCode) {
      case ENTER_KEY:
        event.preventDefault()
        this.handleEnterKey()
        break
      case ARROW_DOWN:
        event.preventDefault() // prevent the cursor from moving
        this.handleDownKey()
        break
      case ARROW_UP:
        event.preventDefault() // prevent the cursor from moving
        this.handleUpKey()
        break
      case ESC_KEY:
        this.clearAutocomplete()
        break
    }
  }

  setActiveItemAtIndex(index) {
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
    this.autocompleteService = this.autocompleteService || new google.maps.places.AutocompleteService()
    this.autocompleteOK = this.autocompleteOK || google.maps.places.PlacesServiceStatus.OK

    this.props.onChange(event.target.value)
    if (!event.target.value) {
      this.clearAutocomplete()
      return
    }
    this.autocompleteService.getPlacePredictions({ ...this.props.options, input: event.target.value }, this.autocompleteCallback)
  }

  autocompleteItemStyle(active) {
    if (active) {
      return { ...defaultStyles.autocompleteItemActive, ...this.props.styles.autocompleteItemActive }
    } else {
      return {}
    }
  }

  inlineStyleFor(...props) {
    const { classNames, styles } = this.props
    // No inline style if className is passed via props for the element.
    if (props.some(prop => classNames.hasOwnProperty(prop))) {
      return {}
    }

    return props.reduce((acc, prop) => {
      return {
        ...acc,
        ...defaultStyles[prop],
        ...styles[prop],
      }
    }, {})
  }

  classNameFor(...props) {
    const { classNames } = this.props

    return props.reduce((acc, prop) => {
      const name = classNames[prop] || ''
      return name ? `${acc} ${name}` : acc
    }, '')
  }

  render() {
    const { classNames, placeholder, styles, value, autoFocus, inputName, inputId } = this.props
    const { autocompleteItems } = this.state

    return (
      <div
        style={this.inlineStyleFor('root')}
        className={this.classNameFor('root')}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          onBlur={() => this.clearAutocomplete()}
          style={this.inlineStyleFor('input')}
          className={this.classNameFor('input')}
          autoFocus={autoFocus}
          name={inputName || ''}
          id={inputId || ''}
        />
        {autocompleteItems.length > 0 && (
          <div
            id="PlacesAutocomplete__autocomplete-container"
            style={this.inlineStyleFor('autocompleteContainer')}
            className={this.classNameFor('autocompleteContainer')}>
            {autocompleteItems.map((p, idx) => (
              <div
                key={p.placeId}
                onMouseOver={() => this.setActiveItemAtIndex(p.index)}
                onMouseDown={() => this.selectAddress(p.suggestion, p.placeId)}
                style={ p.active ? this.inlineStyleFor('autocompleteItem', 'autocompleteItemActive') :this.inlineStyleFor('autocompleteItem') }
                className={ p.active ? this.classNameFor('autocompleteItem', 'autocompleteItemActive') : this.classNameFor('autocompleteItem') }>
                {this.props.autocompleteItem({ suggestion: p.suggestion, formattedSuggestion: p.formattedSuggestion })}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default PlacesAutocompleteBasic
