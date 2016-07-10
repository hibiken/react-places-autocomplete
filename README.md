# react-places-autocomplete

A React component to build a customized UI for Google Maps Places Autocomplete

[![travis build](https://img.shields.io/travis/kenny-hibino/react-places-autocomplete.svg?style=flat-square)](https://travis-ci.org/kenny-hibino/react-places-autocomplete)
[![MIT-License](https://img.shields.io/npm/l/react-places-autocomplete.svg?style=flat-square)]()

### Features
1. Enable you to easily build a customized autocomplete dropdown powered by Google Maps Places Library
2. Utility function to get latitude and longitude using Google Maps Geocoder API

### Installation
To install the stable version

```sh
npm install --save react-places-autocomplete
```

The React component is exported as a default export

```js
import PlacesAutocomplete from 'react-places-autocomplete'
```

`geocodeByAddress` utility function is a named export

```js
import { geocodeByAddress } from 'react-places-autocomplete'
```


### Getting Started
To use this component, you are going to need to load [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

Load the library in your project

```html
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

Declare your PlacesAutocomplete component using React component

```js
import React from 'react'
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete'

class SimpleForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: 'San Francisco, CA' }
    this.setAddress = this.setAddress.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  setAddress(address) {
    this.setState({ address })
  }

  handleFormSubmit(event) {
    event.preventDefault()
    const { address } = this.state

    geocodeByAddress(address,  (err, { lat, lng }) => {
      if (err) {
        console.log('Oh no!', err)
      }

      console.log(`Yay! got latitude and longitude for ${address}`, { lat, lng })
    })
  }

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete
          value={this.state.address}
          setAddress={this.setAddress}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default SimpleForm
```

### Props

`PlacesAutocomplete`

#### value
Type: `String`
Required: `true`

Value displayed in the input field

### setAddress
Type: `function`
Required: `true`

Please see the example above


### License

MIT
