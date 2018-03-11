export const geocodeByAddress = (address, callback) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        // TODO: Remove callback support in the next major version.
        if (callback) {
          /* eslint-disable no-console */
          console.warn(
            'Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyaddress-api"'
          );
          /* eslint-enable no-console */
          callback({ status }, null, results);
          return;
        }

        reject(status);
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        /* eslint-disable no-console */
        console.warn(
          'Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyaddress-api"'
        );
        /* eslint-enable no-console */
        callback(null, latLng, results);
      }

      resolve(results);
    });
  });
};

export const getLatLng = result => {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
      };
      resolve(latLng);
    } catch (e) {
      reject(e);
    }
  });
};

export const geocodeByPlaceId = (placeId, callback) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        // TODO: Remove callback support in the next major version.
        if (callback) {
          /* eslint-disable no-console */
          console.warn(
            'Deprecated: Passing a callback to geocodeByAddress is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyplaceid-api"'
          );
          /* eslint-enable no-console */
          callback({ status }, null, results);
          return;
        }

        reject(status);
      }

      // TODO: Remove callback support in the next major version.
      if (callback) {
        const latLng = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        /* eslint-disable no-console */
        console.warn(
          'Deprecated: Passing a callback to geocodeByPlaceId is deprecated. Please see "https://github.com/kenny-hibino/react-places-autocomplete#geocodebyplaceid-api"'
        );
        /* eslint-enable no-console */
        callback(null, latLng, results);
      }

      resolve(results);
    });
  });
};
