/*** React Component ***/
import PlacesAutocomplete from './PlacesAutocomplete'
export default PlacesAutocomplete

/*** Utils ***/
export const geocodeByAddress = (address, callback) => {
  const geocoder = new google.maps.Geocoder()
  const OK = google.maps.GeocoderStatus.OK

  geocoder.geocode({ address }, (results, status) => {
    if (status !== OK) {
      callback({ status }, null)
      return
    }

    const latLng = {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    }

    callback(null, latLng)
  })
}
