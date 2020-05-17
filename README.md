[![MIT-License](https://img.shields.io/npm/l/react-places-autocomplete.svg?style=flat-square)]()
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat-square)](https://gitter.im/react-places-autocomplete/Lobby)
[![Maintainers Wanted](https://img.shields.io/badge/maintainers-wanted-orange)](https://github.com/hibiken/react-places-autocomplete/issues/296#issuecomment-583764730)

## We are looking for maintainers!
In order to ensure active development going forward, we are looking for maintainers to join the project. [Please contact the project owner if you are interested.](https://github.com/hibiken/react-places-autocomplete/issues/296#issuecomment-583764730)

# React Places Autocomplete



A React component to build a customized UI for Google Maps Places Autocomplete

### Demo

Live demo: [hibiken.github.io/react-places-autocomplete/](https://hibiken.github.io/react-places-autocomplete/)

### Features

1. Enable you to easily build a customized autocomplete dropdown powered by [Google Maps Places Library](https://developers.google.com/maps/documentation/javascript/places)
2. [Utility functions](#utility-functions) to geocode and get latitude and longitude using [Google Maps Geocoder API](https://developers.google.com/maps/documentation/javascript/geocoding)
3. Full control over rendering to integrate well with other libraries (e.g. Redux-Form)
4. Mobile friendly UX
5. WAI-ARIA compliant
6. Support Asynchronous Google script loading

### Installation

To install the stable version

```sh
npm install --save react-places-autocomplete
```

React component is exported as a default export

```js
import PlacesAutocomplete from 'react-places-autocomplete';
```

utility functions are named exports

```js
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from 'react-places-autocomplete';
```

### Getting Started

<a name="load-google-library"></a>
To use this component, you are going to need to load [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/)

Load the library in your project

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

Create your component

```js
import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => console.log('Success', latLng))
      .catch(error => console.error('Error', error));
  };

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}
```

## Props

PlacesAutocomplete is a [Controlled Component](https://facebook.github.io/react/docs/forms.html#controlled-components) with a [Render Prop](https://reactjs.org/docs/render-props.html). Therefore, you MUST pass at least `value` and `onChange` callback to the input element, and render function via `children`.

| Prop                                                    |   Type   |      Required      | Description                                                                                      |
| ------------------------------------------------------- | :------: | :----------------: | ------------------------------------------------------------------------------------------------ |
| [`value`](#value)                                       |  string  | :white_check_mark: | `value` for the input element                                                                    |
| [`onChange`](#onChange)                                 | function | :white_check_mark: | `onChange` function for the input element                                                        |
| [`children`](#children)                                 | function | :white_check_mark: | Render function to specify the rendering                                                         |
| [`onSelect`](#onSelect)                                 | function |                    | Event handler to handle user's select event                                                      |
| [`onError`](#onError)                                   | function |                    | Error handler function that gets called when Google Maps API responds with an error              |
| [`searchOptions`](#searchOptions)                       |  object  |                    | Options to Google Maps API (i.e. bounds, radius)                                                 |
| [`debounce`](#debounce)                                 |  number  |                    | Number of milliseconds to delay before making a call to Google Maps API                          |
| [`highlightFirstSuggestion`](#highlightFirstSuggestion) | boolean  |                    | If set to `true`, first list item in the dropdown will be automatically highlighted              |
| [`shouldFetchSuggestions`](#shouldFetchSuggestions)     | boolean  |                    | Component will hit Google Maps API only if this flag is set `true`                               |
| [`googleCallbackName`](#googleCallbackName)             |  string  |                    | You can provide a callback name to initialize `PlacesAutocomplete` after google script is loaded |

<a name="value"></a>

### value

Type: `string`,
Required: `true`

<a name="onChange"></a>

### onChange

Type: `function`,
Required: `true`

Typically this event handler will update `value` state.

```js
<PlacesAutocomplete
  value={this.state.value}
  onChange={value => this.setState({ value })}
>
  {/* custom render function */}
</PlacesAutocomplete>
```

<a name="children"></a>

### children

Type: `function`
Required: `true`

This is where you render whatever you want to based on the state of `PlacesAutocomplete`.
The function will take an object with the following keys.

* `getInputProps` : function
* `getSuggestionItemProps` : function
* `loading` : boolean
* `suggestions` : array

Simple example

```js
const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions }) => (
  <div className="autocomplete-root">
    <input {...getInputProps()} />
    <div className="autocomplete-dropdown-container">
      {loading && <div>Loading...</div>}
      {suggestions.map(suggestion => (
        <div {...getSuggestionItemProps(suggestion)}>
          <span>{suggestion.description}</span>
        </div>
      ))}
    </div>
  </div>
);

// In render function
<PlacesAutocomplete value={this.state.value} onChange={this.handleChange}>
  {renderFunc}
</PlacesAutocomplete>;
```

#### getInputProps

This function will return the props that you can spread over the `<input />` element.
You can optionally call the function with an object to pass other props to the input.

```js
// In render function
<input {...getInputProps({ className: 'my-input', autoFocus: true })} />
```

#### getSuggestionItemProps

This function will return the props that you can spread over each suggestion item in your
autocomplete dropdown. You MUST call it with `suggestion` object as an argument, and optionally pass an object to pass other props to the element.

```js
// Simple example
<div className="autocomplete-dropdown">
  {suggestions.map(suggestion => (
    <div {...getSuggestionItemProps(suggestion)}>
      {suggestion.description}
    </div>
  ))}
</div>

// Pass options as a second argument
<div className="autocomplete-dropdown">
  {suggestions.map(suggestion => {
    const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
    return (
      <div {...getSuggestionItemProps(suggestion, { className })}>
        {suggestion.description}
      </div>
    );
  })}
</div>
```

#### loading

This is a boolean flag indicating whether or not the request is pending, or has completed.

#### suggestions

This is an array of suggestion objects each containing all the data from Google Maps API and other metadata.

An example of a suggestion object.

```js
{
  active: false,
  description: "San Francisco, CA, USA",
  formattedSuggestion: { mainText: "San Francisco", secondaryText: "CA, USA" },
  id: "1b9ea3c094d3ac23c9a3afa8cd4d8a41f05de50a",
  index: 0,
  matchedSubstrings: [ {length: 8, offset: 0} ],
  placeId: "ChIJIQBpAG2ahYAR_6128GcTUEo",
  terms: [
    { offset: 0, value: "San Francisco" },
    { offset: 15, value: "CA" },
    { offset: 19, value: "USA" }
  ],
  types: ["locality", "political", "geocode"]
}
```

<a name="onSelect"></a>

### onSelect

Type: `function`
Required: `false`,
Default: `null`

You can pass a function that gets called instead of `onChange` function when user
hits the Enter key or clicks on a suggestion item.

The function takes three positional arguments. First argument is `address`, second is `placeId` and third is the entire `suggestion` object.

```js
// NOTE: `placeId` and `suggestion` are null when user hits Enter key with no suggestion item selected.
const handleSelect = (address: string, placeId: ?string, suggestion: ?object) => {
  // Do something with address and placeId and suggestion
}

// Pass this function via onSelect prop.
<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  onSelect={this.handleSelect}
>
  {/* Custom render function */}
</PlacesAutocomplete>
```

<a name="onError"></a>

### onError

Type: `function`
Required: `false`

You can pass `onError` prop to customize the behavior when [google.maps.places.PlacesServiceStatus](https://developers.google.com/maps/documentation/javascript/places#place_details_responses) is not `OK` (e.g., no predictions are found)

Function takes `status` (string) and `clearSuggestions` (function) as parameters

```js
// Log error status and clear dropdown when Google Maps API returns an error.
const onError = (status, clearSuggestions) => {
  console.log('Google Maps API returned error with status: ', status)
  clearSuggestions()
}

<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  onError={onError}
>
  {/* Custom render function */}
</PlacesAutocomplete>
```

<a name="searchOptions"></a>

### searchOptions

Type: `Object`
Required: `false`
Default: `{}`

You can fine-tune the settings passed to the AutocompleteService class with `searchOptions` prop.
This prop accepts an object following the same format as [google.maps.places.AutocompletionRequest](https://developers.google.com/maps/documentation/javascript/reference#AutocompletionRequest)
(except for `input`, which comes from the value of the input field).

```js
// these options will bias the autocomplete predictions toward Sydney, Australia with a radius of 2000 meters,
// and limit the results to addresses only
const searchOptions = {
  location: new google.maps.LatLng(-34, 151),
  radius: 2000,
  types: ['address']
}

<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  searchOptions={searchOptions}
>
  {/* Custom render function */}
</PlacesAutocomplete>
```

<a name="debounce"></a>

### debounce

Type: `number`
Required: `false`
Default: `200`

The number of milliseconds to delay before making a call to Google Maps API.

<a name="highlightFirstSuggestion"></a>

### highlightFirstSuggestion

Type: `boolean`
Required: `false`
Default: `false`

If set to `true`, first suggestion in the dropdown will be automatically set to be active.

<a name="shouldFetchSuggestions"></a>

### shouldFetchSuggestions

Type: `boolean`
Required: `false`
Default: `true`

```js
// Only fetch suggestions when the input text is longer than 3 characters.
<PlacesAutocomplete
  value={this.state.address}
  onChange={this.handleChange}
  shouldFetchSuggestions={this.state.address.length > 3}
>
  {/* custom render function */}
</PlacesAutocomplete>
```

<a name="googleCallbackName"></a>

### googleCallbackName

Type: `string`
Required: `false`
Default: `undefined`

If provided, component will initialize after the browser has finished downloading google script.

**IMPORTANT**: To enable this async mode, you need to provide the same callback name to google script via `callback=[YOUR CALLBACK NAME]`.

Example:

```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=myCallbackFunc"></script>
```

Then, provide `googleCallbackName` prop to `PlacesAutocomplete`.

```js
<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  googleCallbackName="myCallbackFunc"
>
  {/* custom render function */}
</PlacesAutocomplete>
```

**NOTE**: If there are more than one `PlacesAutocomplete` components rendered in the page,
set up a callback function that calls a callback function for each component.

Example:

```html
<script>
window.myCallbackFunc = function() {
  window.initOne && window.initOne();
  window.initTwo && window.initTwo();
}
</script>
<script async defer
src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=myCallbackFunc"></script>
```

```js
<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  googleCallbackName="initOne"
>
  {/* custom render function */}
</PlacesAutocomplete>

<PlacesAutocomplete
  value={this.state.value}
  onChange={this.handleChange}
  googleCallbackName="initTwo"
>
  {/* custom render function */}
</PlacesAutocomplete>
```

<a name="utility-functions"></a>

## Utility Functions

* [`geocodeByAddress`](#geocode-by-address)
* [`geocodeByPlaceId`](#geocode-by-place-id)
* [`getLatLng`](#get-lat-lng)

<a name="geocode-by-address"></a>

### `geocodeByAddress` API

```js
/**
 * Returns a promise
 * @param {String} address
 * @return {Promise}
 */
geocodeByAddress(address);
```

#### address

Type: `String`,
Required: `true`

String that gets passed to Google Maps [Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding)

```js
import { geocodeByAddress } from 'react-places-autocomplete';

// `results` is an entire payload from Google API.
geocodeByAddress('Los Angeles, CA')
  .then(results => console.log(results))
  .catch(error => console.error(error));
```

<a name="geocode-by-place-id"></a>

### `geocodeByPlaceId` API

```js
/**
 * Returns a promise
 * @param {String} placeId
 * @return {Promise}
 */
geocodeByPlaceId(placeId);
```

#### placeId

Type: `String`,
Required: `true`

String that gets passed to Google Maps [Geocoder](https://developers.google.com/maps/documentation/javascript/geocoding)

```js
import { geocodeByPlaceId } from 'react-places-autocomplete';

// `results` is an entire payload from Google API.
geocodeByPlaceId('ChIJE9on3F3HwoAR9AhGJW_fL-I')
  .then(results => console.log(results))
  .catch(error => console.error(error));
```

<a name="get-lat-lng"></a>

### `getLatLng` API

```js
/**
 * Returns a promise
 * @param {Object} result
 * @return {Promise}
 */
getLatLng(result);
```

#### result

Type: `Object`
Required: `true`

One of the element from `results` (returned from Google Maps Geocoder)

```js
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

geocodeByAddress('Tokyo, Japan')
  .then(results => getLatLng(results[0]))
  .then(({ lat, lng }) =>
    console.log('Successfully got latitude and longitude', { lat, lng })
  );
```

### Discussion

Join us on [Gitter](https://gitter.im/react-places-autocomplete/Lobby) if you are interested in contributing!

### License

MIT
