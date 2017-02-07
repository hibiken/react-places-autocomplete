# react-places-autocomplete

A React component to build a customized UI for Google Maps Places Autocomplete ([Demo](https://kenny-hibino.github.io/react-places-autocomplete/))


[![travis build](https://img.shields.io/travis/kenny-hibino/react-places-autocomplete.svg?style=flat-square)](https://travis-ci.org/kenny-hibino/react-places-autocomplete)
[![MIT-License](https://img.shields.io/npm/l/react-places-autocomplete.svg?style=flat-square)]()
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/react-places-autocomplete/Lobby)

### Features
1. Enable you to easily build a customized autocomplete dropdown powered by Google Maps Places Library
2. Utility function to get latitude and longitude using Google Maps Geocoder API

### Installation
To install the stable version

```sh
npm install react-places-autocomplete --save
```

The React component is exported as a default export

```js
import PlacesAutocomplete from 'react-places-autocomplete'
```

`geocodeByAddress` and `geocodeByPlaceId` utility functions are named exports

```js
import { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete'
```

### Demo
See live demo: [kenny-hibino.github.io/react-places-autocomplete/](https://kenny-hibino.github.io/react-places-autocomplete/)

To build the example locally, clone this repo and then run:

```sh
npm run demo
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
    this.onChange = (address) => this.setState({ address })
  }

  handleFormSubmit = (event) => {
    event.preventDefault()
    const { address } = this.state

    geocodeByAddress(address,  (err, { lat, lng }) => {
      if (err) { console.log('Oh no!', err) }

      console.log(`Yay! got latitude and longitude for ${address}`, { lat, lng })
    })
  }

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.onChange}
        />
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default SimpleForm
```

### Props for `PlacesAutocomplete`

#### Require Props:

* value
* onChange

#### Optional Props:

* autocompleteItem
* classNames
* styles
* placeholder
* hideLabel
* onError
* clearItemsOnError
* onSelect
* options
* autoFocus

#### value
Type: `String`,
Required: `true`

Value displayed in the input field

#### onChange
Type: `Function`,
Required: `true`

Please see the example above

#### autocompleteItem
Type: `Functional React Component`,
Required: `false`

The function takes props with `suggestion`, `formattedSuggestion` keys (see the example below).
We highly recommend that you create your own custom `AutocompleteItem` and pass it as a prop.

```js
/***********************************************
 Example #1
 autocompleteItem example with `suggestion`
************************************************/
render() {
  const AutocompleteItem = ({ suggestion }) => (<div><i className="fa fa-map-marker"/>{suggestion}</div>)

  return (
    <PlacesAutocomplete
      value={this.state.value}
      onChange={this.onChange}
      autocompleteItem={AutocompleteItem}
    />
  )
}

/***************************************************
 Example #2
 autocompleteItem example with `formattedSuggestion`
****************************************************/
render() {
  const AutocompleteItem = ({ formattedSuggestion }) => (
    <div>
      <strong>{ formattedSuggestion.mainText }</strong>{' '}
      <small>{ formattedSuggestion.secondaryText }</small>
    </div>
  )

  return (
    <PlacesAutocomplete
      value={this.state.value}
      onChange={this.onChange}
      autocompleteItem={AutocompleteItem}
    />
  )
}
```

#### classNames
Type: `Object`,
Required: `false`

You can give a custom css classes to elements.
Accepted keys are `root`, `label`, `input`, `autocompleteContainer`

```js
// classNames example
render() {
  const cssClasses = {
    root: 'form-group',
    label: 'form-label',
    input: 'form-control',
    autocompleteContainer: 'my-autocomplete-container'
  }

  return (
    <PlacesAutocomplete
      value={this.state.address}
      onChange={this.onChange}
      classNames={cssClasses}
    />
  )
}
```
Now you can easily apply custom CSS styles using the classNames!

#### styles
Type `Object`,
Required: `false`

You can provide custom inline styles to elements.
Accepted keys are `root`, `label`, `input`, `autocompleteContainer`, `autocompleteItem`, `autocompleteItemActive`

```js
// custom style examples
render() {
  const myStyles = {
    root: { position: 'absolute' },
    label: { color: 'red' },
    input: { width: '100%' },
    autocompleteContainer: { backgroundColor: 'green' },
    autocompleteItem: { color: 'black' },
    autocompleteItemActive: { color: 'blue' }
  }

  return (
    <PlacesAutocomplete
      value={this.state.address}
      onChange={this.onChange}
      styles={myStyles}
    />
  )
}
```

#### placeholder
Type: `String`,
Required: `false`,
Default: `"Address"`

You can pass `placeholder` prop to customize input's placeholder text

#### hideLabel
Type: `Boolean`
Required: `false`,
Default: `false`

You can set `hideLabel` to `true` to not render the label element

#### onError
Type: `Function`
Required: `false`

You can pass `onError` prop to customize the behavior when [google.maps.places.PlacesServiceStatus](https://developers.google.com/maps/documentation/javascript/places#place_details_responses) is not `OK` (e.g., no predictions are found)

Function takes `status` as a parameter

#### clearItemsOnError
Type: `Boolean`
Required: `false`
Default: `false`

You can pass `clearItemsOnError` prop to indicate whether the autocomplete predictions should be cleared when `google.maps.places.PlacesServiceStatus` is not OK

#### onSelect
Type: `Function`
Required: `false`,
Default: `null`

You can pass a function that gets called instead of `onChange` function when user
hits the Enter key or clicks on an autocomplete item.

The function takes two positional arguments. First argument is `address`, second is `placeId`.

```js
const handleSelect = (address, placeId) => {
  this.setState({ address, placeId })

  // You can do other things with address string or placeId. For example, geocode :)
}

// Pass this function via onSelect prop.
<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  onSelect={this.handleSelect}
/>
```

#### options
Type: `Object`
Required: `false`
Default: `{}`

You can fine-tune the settings passed to the AutocompleteService class with `options` prop.
This prop accepts an object following the same format as [google.maps.places.AutocompletionRequest](https://developers.google.com/maps/documentation/javascript/reference#AutocompletionRequest)
(except for `input`, which comes from the value of the input field).

```js
// these options will bias the autocomplete predictions toward Sydney, Australia with a radius of 2000 meters,
// and limit the results to addresses only
const options = {
  location: new google.maps.LatLng(-34, 151),
  radius: 2000,
  types: ['address']
}

<PlacesAutocomplete
  value={this.state.address}
  onChange={this.onChange}
  options={options}
/>
```

#### autoFocus
Type: `Boolean`
Required:  `false`
Default: `false`

### `geocodeByAddress` API

```js
geocodeByAddress(address, callback)
```

#### address
Type: `String`,
Required: `true`

String that gets passed to Google Maps [Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding)

#### callback
Type: `Function`,
Required: `true`

Three arguments will be passed to the callback.

First argument is an error object, set to `null` when there's no error.

Second argument is an object with `lat` and `lng` keys

Third argument (optional) is entire payload from Google API

```js
import { geocodeByAddress } from 'react-places-autocomplete'

geocodeByAddress('Los Angeles, CA', (error, { lat, lng }, results) => {
  if (error) { return }

  console.log('Geocoding success!', { lat, lng })
  console.log('Entire payload from Google API', results)
})
```

### `geocodeByPlaceId` API

```js
geocodeByPlaceId(placeId, callback)
```

#### placeId
Type: `String`,
Required: `true`

String that gets passed to Google Maps [Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding)

#### callback
Type: `Function`,
Required: `true`

Three arguments will be passed to the callback.

First argument is an error object, set to `null` when there's no error.

Second argument is an object with `lat` and `lng` keys

Third argument (optional) is entire payload from Google API

```js
import { geocodeByPlaceId } from 'react-places-autocomplete'

geocodeByPlaceId('ChIJE9on3F3HwoAR9AhGJW_fL-I', (error, { lat, lng }, results) => {
  if (error) { return }

  console.log('Geocoding success!', { lat, lng })
  console.log('Entire payload from Google API', results)
})
```
### Discussion

Join us on [Gitter](https://gitter.im/react-places-autocomplete/Lobby) if you are interested in contributing!

### License

MIT
