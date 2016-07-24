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
    this.onChange = (address) => this.setState({ address })
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
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

The function takes props with `suggestion` key (see the example below).
We highly recommend that you create your own custom `AutocompleteItem` and pass it as a prop.

```js
// autocompleteItem example (with font-awesome icon)
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

#### onSelect
Type: `function`
Required: `false`,
Default: `null`

You can pass a function that gets called instead of `onChange` function when user
hits the Enter key or clicks on an autocomplete item.


### `geocodeByAddress` API

```js
geocodeByAddress(address, callback)
```

#### address
Type: `String`,
Required: `true`

String that gets passed to Google Maps Geocoder

#### callback
Type: `Function`,
Required: `true`

Two arguments will be passed to the callback.

First argument is an error object, set to `null` when there's no error.

Second argument is an object with `lat` and `lng` keys



### License

MIT
