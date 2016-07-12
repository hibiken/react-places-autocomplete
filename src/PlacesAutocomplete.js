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

    this.state = {
      autocompleteItems: []
    }

    this.autocompleteCallback = this.autocompleteCallback.bind(this)
    this.handleAddressKeyDown = this.handleAddressKeyDown.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
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
    this.props.setAddress(address)
  }

  _setActiveItem(index) {
    const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion
    this.setState({
      autocompleteItems: this.state.autocompleteItems.map((item, idx) => {
        if (idx === index) {
          return { ...item, active: true }
        } else {
          return { ...item, active: false }
        }
      }),
    })
    this.props.setAddress(activeName)
  }

  _handleEnterKey() {
    const activeItem = this.state.autocompleteItems.find(item => item.active)
    if (activeItem === undefined) { return }

    this.clearAutocomplete()
    this.props.setAddress(activeItem.suggestion)
  }

  _handleDownKey() {
    const activeItem = this.state.autocompleteItems.find(item => item.active)
    if (activeItem === undefined) {
      this._setActiveItem(0)
    } else {
      const nextId = (activeItem.index + 1) % this.state.autocompleteItems.length
      this._setActiveItem(nextId)
    }
  }

  _handleUpKey() {
    const activeItem = this.state.autocompleteItems.find(item => item.active)
    if (activeItem === undefined) {
      this._setActiveItem(this.state.autocompleteItems.length - 1)
    } else {
      let prevId
      if (activeItem.index === 0) {
        prevId = this.state.autocompleteItems.length - 1
      } else {
        prevId = (activeItem.index - 1) % this.state.autocompleteItems.length
      }
      this._setActiveItem(prevId)
    }
  }

  handleAddressKeyDown(event) {
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

  handleItemMouseOver(index) {
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

  handleAddressChange(event) {
    this.props.setAddress(event.target.value)
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
            onMouseOver={() => this.handleItemMouseOver(p.index)}
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
      <fieldset
        style={defaultStyles.autocompleteContainer}
        className={classNames.container || ''}
      >
        {this.renderLabel()}
        <input
          type="text"
          placeholder={placeholder}
          className={classNames.input || ''}
          value={value}
          onChange={this.handleAddressChange}
          onKeyDown={this.handleAddressKeyDown}
        />
        {this.renderAutocomplete()}
      </fieldset>
    )
  }
}

PlacesAutocomplete.propTypes = {
  value: React.PropTypes.string.isRequired,
  setAddress: React.PropTypes.func.isRequired,
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
