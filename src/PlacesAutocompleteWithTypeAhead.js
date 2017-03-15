/*
* Copyright (c) 2017 Ken Hibino.
* Licensed under the MIT License (MIT).
* See https://kenny-hibino.github.io/react-places-autocomplete
*/

import React, { Component } from 'react'
import defaultStyles from './defaultStyles'

class PlacesAutocompleteWithTypeAhead extends Component {
  constructor(props) {
    super(props)

    this.state = {
      autocompleteItems: [],
      firstSuggestion: '',
      userTypedValue: '',
      shouldTypeAhead: true,
    }

    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    this.autocompleteService = new google.maps.places.AutocompleteService()
    this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK
    this.autocompleteZeroResult = google.maps.places.PlacesServiceStatus.ZERO_RESULTS
  }

  componentDidUpdate(prevProps, prevState) {
    const { firstSuggestion, userTypedValue } = this.state

    if (userTypedValue.length < prevState.userTypedValue.length) {
      return // noop
    }

    if (this.shouldSoftAutcomplete()) {
      this.refs.inputField.setSelectionRange(userTypedValue.length, firstSuggestion.length)
    }
  }

  autocompleteCallback(predictions, status) {
    if (status === this.autocompleteZeroResult) {
      this.setState({
        autocompleteItems: [],
        firstSuggestion: '',
      })
      return
    }

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
      })),
      firstSuggestion: predictions[0].description,
    })

    this.updateInputValue()
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

  handleAutocompleteItemMouseDown(address, placeId) {
    this.selectAddress(address, placeId)
    this.setState({
      userTypedValue: address,
    })
  }

  getActiveItem() {
    return this.state.autocompleteItems.find(item => item.active)
  }

  selectActiveItemAtIndex(index) {
    const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion
    this.setActiveItemAtIndex(index)
    this.props.onChange(activeName)
    this.setState({ userTypedValue: activeName })
  }

  handleEnterKey() {
    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.handleEnterKeyWithoutActiveItem()
    } else {
      this.selectAddress(activeItem.suggestion, activeItem.placeId)
    }

    this.refs.inputField.focus()
    this.refs.inputField.setSelectionRange(0,0)
    this.setState({
      userTypedValue: this.props.value
    })
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
    const activeItem = this.getActiveItem()
    if (activeItem === undefined) {
      this.selectActiveItemAtIndex(0)
    } else {
      const nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length
      this.selectActiveItemAtIndex(nextIndex)
    }
  }

  handleUpKey() {
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

  handleDeleteKey() {
    const { userTypedValue, firstSuggestion } = this.state
    if (userTypedValue.length === 0) {
      return // noop
    }
    const selectionString = window.getSelection().toString()
    const cursorPosition = this.refs.inputField.selectionStart
    const isPlainBackSpace =  (
      selectionString === firstSuggestion.replace(userTypedValue, '') ||
      selectionString.length === 0
    )

    if (isPlainBackSpace) {
      this.setState({
        userTypedValue: userTypedValue.slice(0, cursorPosition - 1) + userTypedValue.slice(cursorPosition, userTypedValue.length),
        shouldTypeAhead: false,
        firstSuggestion: '',
      })
    } else {
      this.setState({
        userTypedValue: this.props.value.replace(selectionString, ''),
        shouldTypeAhead: false,
        firstSuggestion: '',
      })
    }
  }

  handleTabKey() {
    this.refs.inputField.focus()
    this.refs.inputField.setSelectionRange(0,0)
    this.refs.inputField.blur()
    this.setState({
      userTypedValue: this.props.value
    })
  }

  handleRightLeftKey() {
    this.setState({
      userTypedValue: this.props.value,
      shouldTypeAhead: false,
    })
  }

  handleDefaultKey(event) {
    if (event.key.length > 1) { return }
    const { userTypedValue } = this.state
    const selectionString = window.getSelection().toString()

    if (selectionString.length === 0) {
      const cursorPosition = this.refs.inputField.selectionStart
      this.setState({
        userTypedValue: this.props.value.slice(0, cursorPosition) + event.key + this.props.value.slice(cursorPosition, this.props.value.length),
        shouldTypeAhead: true,
      })
    } else if (this.props.value === `${userTypedValue}${selectionString}`) {
      this.setState({
        userTypedValue: this.fixCasing(this.state.userTypedValue + event.key),
        shouldTypeAhead: true,
      })
    } else {
      this.setState({
        userTypedValue: this.props.value.replace(selectionString, event.key),
        shouldTypeAhead: false,
      })
    }
  }

  handleInputKeyDown(event) {
    const onlyShiftKeyDown = (event.shiftKey && event.keyCode === 16)
    const onlyAltKeyDown = (event.altKey && event.keyCode === 18)
    if ( onlyShiftKeyDown || onlyAltKeyDown || event.ctrlKey || event.metaKey) {
      return // noop
    }

    const ARROW_LEFT = 37
    const ARROW_UP = 38
    const ARROW_RIGHT = 39
    const ARROW_DOWN = 40
    const ENTER_KEY = 13
    const ESC_KEY = 27
    const DELETE_KEY = 8
    const TAB_KEY = 9

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
      case DELETE_KEY:
        this.handleDeleteKey()
        break
      case TAB_KEY:
        this.handleTabKey()
        break;
      case ARROW_LEFT:
      case ARROW_RIGHT:
        this.handleRightLeftKey()
        break
      default:
        this.handleDefaultKey(event)
    }
  }

  fixCasing(newValue) {
    const { firstSuggestion} = this.state
    if (firstSuggestion.length === 0) {
      return newValue
    }

    if (this.isMatch(newValue, firstSuggestion)) {
      return firstSuggestion.substr(0, newValue.length)
    }

    return newValue
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

  updateInputValue() {
    const { firstSuggestion, userTypedValue } = this.state
    if (this.shouldSoftAutcomplete()) {
      this.props.onChange(firstSuggestion)
    } else {
      this.props.onChange(userTypedValue)
    }
  }

  shouldSoftAutcomplete() {
    const { firstSuggestion, userTypedValue, shouldTypeAhead } = this.state
    return (
      (firstSuggestion !== '' && userTypedValue !== '') &&
      this.isMatch(userTypedValue, firstSuggestion) &&
      shouldTypeAhead
    )
  }

  handleInputChange(event) {
    this.updateInputValue()

    const { userTypedValue } = this.state
    if (userTypedValue.length === 0) {
      this.clearAutocomplete()
      return
    }

    if (this.state.shouldTypeAhead) {
      this.autocompleteService.getPlacePredictions({ ...this.props.options, input: userTypedValue }, this.autocompleteCallback)
    }
  }

  autocompleteItemStyle(active) {
    if (active) {
      return {
        ...(!this.props.classNames.autocompleteItem ? defaultStyles.autocompleteItemActive : {}),
        ...this.props.styles.autocompleteItemActive
      }
    } else {
      return {}
    }
  }

  autocompleteItemClassNames(active) {
    const { classNames } = this.props
    if (active) {
      return (classNames.autocompleteItem || '') + ' ' + (classNames.autocompleteItemActive || '')
    } else {
      return classNames.autocompleteItem || ''
    }
  }

  renderAutocomplete() {
    const { autocompleteItems } = this.state
    const { classNames, styles } = this.props
    if (autocompleteItems.length === 0) { return null }
    return (
      <div
        id="PlacesAutocomplete__autocomplete-container"
        className={classNames.autocompleteContainer || ''}
        style={{ ...(!classNames.autocompleteContainer ? defaultStyles.autocompleteContainer : {}), ...styles.autocompleteContainer }}>
        {autocompleteItems.map((p, idx) => (
          <div
            key={p.placeId}
            onMouseOver={() => this.setActiveItemAtIndex(p.index)}
            onMouseDown={() => this.handleAutocompleteItemMouseDown(p.suggestion, p.placeId)}
            className={this.autocompleteItemClassNames(p.active)}
            style={{ ...(!classNames.autocompleteItem ? defaultStyles.autocompleteItem : {}), ...styles.autocompleteItem, ...this.autocompleteItemStyle(p.active) }}>
            {this.props.autocompleteItem({ suggestion: p.suggestion, formattedSuggestion: p.formattedSuggestion })}
          </div>
        ))}
      </div>
    )
  }

  isMatch(subject, target) {
    const normalizedSubject = subject.toLowerCase()
    const normalizedTarget = target.toLowerCase()
    return normalizedSubject === normalizedTarget.substr(0, subject.length)
  }

  renderInput() {
    const { firstSuggestion, userTypedValue } = this.state
    const { classNames, placeholder, styles, value, autoFocus, inputName } = this.props
    return (
      <input
        type="text"
        placeholder={placeholder}
        className={classNames.input || ''}
        value={value}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        onBlur={() => this.clearAutocomplete()}
        style={styles.input}
        autoFocus={autoFocus}
        name={inputName || ''}
        ref="inputField"
      />
    )
  }

  render() {
    const { classNames, styles } = this.props
    return (
      <div
        style={{ ...(!classNames.root ? defaultStyles.root : {}), ...styles.root }}
        className={classNames.root || ''}>
        {this.renderInput()}
        {this.renderAutocomplete()}
      </div>
    )
  }
}

export default PlacesAutocompleteWithTypeAhead
