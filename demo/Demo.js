import React from 'react'
import PlacesAutocomplete, { geocodeByAddress } from '../src'

class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      address: '',
      geocodeResults: null,
      loading: false
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderGeocodeFailure = this.renderGeocodeFailure.bind(this)
    this.renderGeocodeSuccess = this.renderGeocodeSuccess.bind(this)
  }

  handleSelect(address) {
    this.setState({
      address,
      loading: true
    })

    geocodeByAddress(address,  (err, { lat, lng }) => {
      if (err) {
        console.log('Oh no!', err)
        this.setState({
          geocodeResults: this.renderGeocodeFailure(err),
          loading: false
        })
      }
      console.log(`Yay! got latitude and longitude for ${address}`, { lat, lng })
      this.setState({
        geocodeResults: this.renderGeocodeSuccess(lat, lng),
        loading: false
      })
    })
  }

  handleChange(address) {
    this.setState({
      address,
      geocodeResults: null
    })

  }

  renderGeocodeFailure(err) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {err}
      </div>
    )
  }

  renderGeocodeSuccess(lat, lng) {
    return (
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> Geocoder found latitude and longitude: <strong>{lat}, {lng}</strong>
      </div>
    )
  }

  render() {
    const cssClasses = {
      root: 'form-group',
      label: 'form-label',
      input: 'Demo__search-input',
      autocompleteContainer: 'Demo__autocomplete-container',
      autocompleteItem: 'my-autocomplete-item',
      autocompleteItemActive: 'my-autocomplete-item--active'
    }

    const AutocompleteItem = ({ formattedSuggestion }) => (
      <div className="Demo__suggestion-item">
        <i className='fa fa-map-marker Demo__suggestion-icon'/>
        <strong>{formattedSuggestion.mainText}</strong>{' '}
        <small className="text-muted">{formattedSuggestion.secondaryText}</small>
      </div>)

    return (
      <div className='page-wrapper'>
        <div className='container'>
          <h1 className='display-3'>react-places-autocomplete <i className='fa fa-map-marker header'/></h1>
          <p className='lead'>A React component to build a customized UI for Google Maps Places Autocomplete</p>
          <hr />
          <a href='https://github.com/kenny-hibino/react-places-autocomplete' className='Demo__github-link' target="_blank" >
            <span className='fa fa-github Demo__github-icon'></span>
            &nbsp;View on GitHub
          </a>
        </div>
        <div className='container'>
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            classNames={cssClasses}
            renderInlineStyles={false}
            autocompleteItem={AutocompleteItem}
            autoFocus={true}
            placeholder="Search Places"
            hideLabel={true}
            inputName="Demo__input"
            onEnterKeyDown={this.handleSelect}
          />
          {this.state.loading ? <div><i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner" /></div> : null}
          {!this.state.loading && this.state.geocodeResults ?
            <div className='geocoding-results'>{this.state.geocodeResults}</div> :
          null}
        </div>
      </div>
    )
  }
}

export default Demo
