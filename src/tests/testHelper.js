import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import jsdom from 'jsdom'

/*** Set up test environment to run in a browser-like environment ***/
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = global.document.defaultView

/*** Mock Google Maps JavaScript API ***/
const google = {
  maps: {
    places: {
      AutocompleteService: () => {},
      PlacesServiceStatus: {
        OK: 'OK'
      }
    }
  }
}
global.google = google
global.window.google = google

chai.use(chaiEnzyme())

export { expect }
