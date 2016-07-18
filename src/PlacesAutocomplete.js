import React from 'react'

const defaultStyles = {
  autocompleteContainer: {
    position: 'relative',
    paddingBottom: '0px',
  },
  autocompleteWrapper: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555',
    width: '100%',
  },
  autocompleteItem: {
    padding: '10px',
    color: '#555',
    cursor: 'pointer',
  }
}

class PlacesAutocomplete extends React.Component {
  constructor(props) {
    super(props)

    this.state = { autocompleteItems: [] }

    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.handleInputKeyDown = this.handleInputKeyDown.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    this.autocompleteService = new google.maps.places.AutocompleteService()
    this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK
  }

  autocompleteCallback(predictions, status) {
    if (status != this.autocompleteOK) { console.error('place autocomplete failed'); return; }
    this.setState({
      autocompleteItems: predictions.map((p, idx) => ({
        suggestion: p.description,
        placeId: p.place_id,
        active: false,
        index: idx
      }))
    })
  }

  clearAutocomplete() {
    this.setState({ autocompleteItems: [] })
  }

  selectAddress(address) {
    this.clearAutocomplete()
    this.props.onChange(address)
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
    if (activeItem === undefined) { return }

    this.clearAutocomplete()
    this.props.onChange(activeItem.suggestion)
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

  handleInputKeyDown(event) {
    event.preventDefault()
    const ARROW_UP = 38
    const ARROW_DOWN = 40
    const ENTER_KEY = 13

    switch (event.keyCode) {
      case ENTER_KEY:
        this._handleEnterKey()
        break
      case ARROW_DOWN:
        this._handleDownKey()
        break
      case ARROW_UP:
        this._handleUpKey()
        break
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
      return;
    }
    this.autocompleteService.getPlacePredictions({ input: event.target.value }, this.autocompleteCallback)
  }

  // TODO: this should be customizable.
  autocompleteItemStyle(active) {
    if (active) {
      return { backgroundColor: '#fafafa' }
    } else {
      return { backgroundColor: '#ffffff' }
    }
  }

  renderLabel() {
    if (this.props.hideLabel) { return null }
    return (<label className={this.props.classNames.label || ''}>Location</label>)
  }

  renderAutocomplete() {
    const { autocompleteItems } = this.state
    if (autocompleteItems.length === 0) { return null }
    return (
      <div
        id="PlacesAutocomplete__autocomplete-container"
        className={this.props.classNames.autocompleteContainer || ''}
        style={defaultStyles.autocompleteWrapper}>
        {autocompleteItems.map((p, idx) => (
          <div
            key={p.placeId}
            onMouseOver={() => this._setActiveItemAtIndex(p.index)}
            onClick={() => this.selectAddress(p.suggestion)}
            style={{ ...this.autocompleteItemStyle(p.active), ...defaultStyles.autocompleteItem }}>
            {this.props.autocompleteItem({ suggestion: p.suggestion })}
          </div>
        ))}
      </div>
    )
  }

  render() {
    const { classNames, placeholder, value } = this.props
    return (
      <div
        style={defaultStyles.autocompleteContainer}
        className={classNames.container || ''}
      >
        {this.renderLabel()}
        <input
          type="text"
          placeholder={placeholder}
          className={classNames.input || ''}
          value={value}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
        />
        {this.renderAutocomplete()}
      </div>
    )
  }
}

PlacesAutocomplete.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  hideLabel: React.PropTypes.bool,
  autocompleteItem: React.PropTypes.func,
  classNames: React.PropTypes.shape({
    container: React.PropTypes.string,
    label: React.PropTypes.string,
    input: React.PropTypes.string,
    autocompleteContainer: React.PropTypes.string,
  }),
};

PlacesAutocomplete.defaultProps = {
  placeholder: 'Address',
  hideLabel: false,
  classNames: {},
  autocompleteItem: ({ suggestion }) => (<div>{suggestion}</div>)
}

export default PlacesAutocomplete
