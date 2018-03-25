/*** Mock Google Maps JavaScript API ***/
const google = {
  maps: {
    places: {
      AutocompleteService: () => {},
      PlacesServiceStatus: {
        OK: 'OK',
      },
    },
  },
};
global.window.google = google;
