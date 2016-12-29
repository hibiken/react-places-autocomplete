import React from 'react'

const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
  },
  autocompleteOverlay: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9998,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555',
    width: '100%',
    zIndex: 9999,
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px',
    color: '#555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa'
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
    this._handleSelect(address)
  }

  _handleSelect(address) {
    this.props.onSelect ? this.props.onSelect(address) : this.props.onChange(address)
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
    this._handleSelect(activeItem.suggestion)
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
    const ARROW_UP = 38
    const ARROW_DOWN = 40
    const ENTER_KEY = 13

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

  autocompleteItemStyle(active) {
    if (active) {
      return { ...defaultStyles.autocompleteItemActive, ...this.props.styles.autocompleteItemActive }
    } else {
      return {}
    }
  }

  renderLabel() {
    if (this.props.hideLabel) { return null }
    return (<label style={this.props.styles.label} className={this.props.classNames.label || ''}>Location</label>)
  }

  renderOverlay() {
    if (this.state.autocompleteItems.length === 0) { return null }
    return (
      <div
        className="PlacesAutocomplete__overlay"
        style={defaultStyles.autocompleteOverlay}
        onClick={() => this.clearAutocomplete()}>
      </div>
    )
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
            onClick={() => this.selectAddress(p.suggestion)}
            style={{ ...defaultStyles.autocompleteItem, ...styles.autocompleteItem, ...this.autocompleteItemStyle(p.active) }}>
            {this.props.autocompleteItem({ suggestion: p.suggestion })}
          </div>
        ))}
      </div>
    )
  }

  // TODO: remove `classNames.container` in the next version release.
  render() {
    const { classNames, placeholder, styles, value } = this.props
    return (
      <div
        style={{ ...defaultStyles.root, ...styles.root }}
        className={classNames.root || classNames.container || ''}
      >
        {this.renderLabel()}
        <input
          type="text"
          placeholder={placeholder}
          className={classNames.input || ''}
          value={value}
          onChange={this.handleInputChange}
          onKeyDown={this.handleInputKeyDown}
          style={styles.input}
        />
        {this.renderOverlay()}
        {this.renderAutocomplete()}
      </div>
    )
  }
}

PlacesAutocomplete.propTypes = {
  value: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  onSelect: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  hideLabel: React.PropTypes.bool,
  autocompleteItem: React.PropTypes.func,
  classNames: React.PropTypes.shape({
    root: React.PropTypes.string,
    label: React.PropTypes.string,
    input: React.PropTypes.string,
    autocompleteContainer: React.PropTypes.string,
  }),
  styles: React.PropTypes.shape({
    root: React.PropTypes.object,
    label: React.PropTypes.object,
    input: React.PropTypes.object,
    autocompleteContainer: React.PropTypes.object,
    autocompleteItem: React.PropTypes.object,
    autocompleteItemActive: React.PropTypes.object
  })
};

PlacesAutocomplete.defaultProps = {
  placeholder: 'Address',
  hideLabel: false,
  classNames: {},
  autocompleteItem: ({ suggestion }) => (<div>{suggestion}</div>),
  styles: {}
}

export default PlacesAutocomplete
