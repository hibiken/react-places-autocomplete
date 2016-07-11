import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import jsdom from 'jsdom'

/*** Set up test environment to run in a browser-like environment ***/
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = global.document.defaultView

/*** Mock Google Maps JavaScript API ***/
global.google = {
  maps: {
    places: {
      AutocompleteService: () => {},
      PlacesServiceStatus: {
        OK: 'OK'
      }
    }
  }
}

chai.use(chaiEnzyme())

export { expect }
