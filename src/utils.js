export const geocodeByAddress = (address, callback) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder()
    const OK = google.maps.GeocoderStatus.OK

    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        if (callback) {
          console.warn('Callback for geocodeByAddress is deprecated and will be removed in the next version on react-places-autocomplete. Please see: https://github.com/kenny-hibino/react-places-autocomplete/blob/master/README.md#geocodebyaddress-api')
          callback({ status }, null, results)
        }
        return reject({ status }, results)
      }

      const latLng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }

      if (callback) {
        callback(null, latLng, results)
      }
      return resolve(latLng, results)
    })
  })
}

export const geocodeByPlaceId = (placeId, callback) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder()
    const OK = google.maps.GeocoderStatus.OK

    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        if (callback) {
          console.warn('Callback for geocodeByPlaceId is deprecated and will be removed in the next version on react-places-autocomplete. Please see: https://github.com/kenny-hibino/react-places-autocomplete/blob/master/README.md#geocodebyplaceid-api')
          callback({ status }, null, null)
        }
        return reject({ status }, results)
      }

      const latLng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }

      if (callback) {
        callback(null, latLng, results)
      }
      return resolve(latLng, results)
    })
  })
}
