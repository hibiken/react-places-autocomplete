export const geocodeByAddress = (address, callback) => {
  const geocoder = new google.maps.Geocoder()
  const OK = google.maps.GeocoderStatus.OK

  geocoder.geocode({ address }, (results, status) => {
    if (status !== OK) {
      callback({ status }, null, null)
      return
    }

    const latLng = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    const placeId = results[0].place_id;

    callback(null, latLng, placeId)
  })
}
