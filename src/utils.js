import q from 'q'

export const geocodeByAddress = (address, callback) => {
  const deferred = q.defer()
  const geocoder = new google.maps.Geocoder()
  const OK = google.maps.GeocoderStatus.OK

  geocoder.geocode({ address }, (results, status) => {
    if (status !== OK) {
      if (callback) {
        callback({ status }, null, results)
      }
      return deferred.reject({ error: { status }, results })
    }

    const latLng = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    if (callback) {
      callback(null, latLng, results)
    }
    return deferred.resolve({ latLng, results })
  })

  return deferred.promise
}

export const geocodeByPlaceId = (placeId, callback) => {
  const deferred = q.defer()
  const geocoder = new google.maps.Geocoder()
  const OK = google.maps.GeocoderStatus.OK

  geocoder.geocode({ placeId }, (results, status) => {
    if (status !== OK) {
      if (callback) {
        callback({ status }, null, null)
      }
      return deferred.reject({ error: { status } })
    }

    const latLng = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    if (callback) {
      callback(null, latLng, results)
    }
    return deferred.resolve({ latLng, results })
  })

  return deferred.promise
}
