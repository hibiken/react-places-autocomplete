export const geocodeByAddress = (address, callback) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder()
    const OK = google.maps.GeocoderStatus.OK

    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        if (callback) {
          callback({ status }, null, results)
        }
        return reject({ error: { status }, results })
      }

      const latLng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }

      if (callback) {
        callback(null, latLng, results)
      }
      return resolve({ latLng, results })
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
          callback({ status }, null, null)
        }
        return reject({ error: { status } })
      }

      const latLng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      }

      if (callback) {
        callback(null, latLng, results)
      }
      return resolve({ latLng, results })
    })
  })
}
