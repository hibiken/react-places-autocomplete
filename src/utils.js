export const geocodeByAddress = (address, callback) => {
  const geocoder = new google.maps.Geocoder()
  const OK = google.maps.GeocoderStatus.OK

  geocoder.geocode({ address }, (results, status) => {
    if (status !== OK) {
      callback({ status }, null, results)
      return
    }

    const latLng = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    callback(null, latLng, results)
  })
}

export const geocodeByPlaceId = (placeId, callback) => {
  const geocoder = new google.maps.Geocoder()
  const OK = google.maps.GeocoderStatus.OK

  geocoder.geocode({ placeId }, (results, status) => {
    if (status !== OK) {
      callback({ status }, null, null)
      return
    }

    const latLng = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    callback(null, latLng, results)
  })
}
