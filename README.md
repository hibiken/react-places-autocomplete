# react-places-autocomplete

A React component to build a customized UI for Google Maps Places Autocomplete

[![travis build](https://img.shields.io/travis/kenny-hibino/react-places-autocomplete.svg?style=flat-square)](https://travis-ci.org/kenny-hibino/react-places-autocomplete)
[![MIT-License](https://img.shields.io/npm/l/react-places-autocomplete.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/v/react-places-autocomplete.svg?style=flat-square)]()

### Features
1. Autocomplete dropdown using Google Maps Places Library
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
