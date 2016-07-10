import React from 'react'

const styles = {
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
      placeAutocomplete: []
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
      placeAutocomplete: predictions.map((p, idx) => ({
        suggestion: p.description,
        placeId: p.place_id,
        active: false,
        index: idx
      }))
    })
  }

  clearAutocomplete() {
    this.setState({ placeAutocomplete: [] })
  }

  selectAddress(address) {
    this.clearAutocomplete()
    this.props.setAddress(address)
  }

  _setActiveItem(index) {
    const activeName = this.state.placeAutocomplete.find(item => item.index === index).suggestion
    this.setState({
      placeAutocomplete: this.state.placeAutocomplete.map((item, idx) => {
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
    const activeItem = this.state.placeAutocomplete.find(item => item.active)
    if (activeItem === undefined) { return }

    this.clearAutocomplete()
    this.props.setAddress(activeItem.suggestion)
  }

  _handleDownKey() {
    const activeItem = this.state.placeAutocomplete.find(item => item.active)
    if (activeItem === undefined) {
      this._setActiveItem(0)
    } else {
      const nextId = (activeItem.index + 1) % this.state.placeAutocomplete.length
      this._setActiveItem(nextId)
    }
  }

  _handleUpKey() {
    const activeItem = this.state.placeAutocomplete.find(item => item.active)
    if (activeItem === undefined) {
      this._setActiveItem(this.state.placeAutocomplete.length - 1)
    } else {
      let prevId
      if (activeItem.index === 0) {
        prevId = this.state.placeAutocomplete.length - 1
      } else {
        prevId = (activeItem.index - 1) % this.state.placeAutocomplete.length
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
      placeAutocomplete: this.state.placeAutocomplete.map((item, idx) => {
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

  autocompleteItemStyle(active) {
    if (active) {
      return { backgroundColor: '#fafafa' }
    } else {
      return { backgroundColor: '#ffffff' }
    }
  }

  renderAutocomplete() {
    const { placeAutocomplete } = this.state
    if (placeAutocomplete.length === 0) { return null }
    return (
      <div className={styles.autocompleteWrapper}>
        {placeAutocomplete.map((p, idx) => (
          <div
            key={p.placeId}
            className={styles.autocompleteItem}
            onMouseOver={() => this.handleItemMouseOver(p.index)}
            onClick={() => this.selectAddress(p.suggestion)}
            style={this.autocompleteItemStyle(p.active)}>
            <i className="fa fa-map-marker" style={{color: '#b87d4e', marginRight: '5px'}}/> {p.suggestion}
          </div>
        ))}
      </div>
    )
  }

  render() {
    return (
      <fieldset className={`form-group ${styles.autocompleteContainer}`}>
        <label className="form-label--simple">Location</label>
        <input
          type="text"
          placeholder="Address"
          className="form-input--simple"
          value={this.props.value}
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
};

export default PlacesAutocomplete
