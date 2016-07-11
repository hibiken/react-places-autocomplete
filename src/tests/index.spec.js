import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import { expect } from './testHelper'
import PlacesAutocomplete, { geocodeByAddress } from '../index.js'

/*** Enzyme ***/
describe('<PlacesAutocomplete />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete value="San Francisco, Ca" setAddress={() => {}} />)
  })

  it('renders an input element', () => {
    expect(wrapper.find('input')).to.have.length(1)
  })

  it('initially does not have autocomplete dropdown', () => {
    expect(wrapper.find('.autocomplete__wrapper')).to.have.length(0)
  })

  it('renderes an label element', () => {
    expect(wrapper.find('label')).to.have.length(1)
  })
});

















// TODO: test geocodeByAddress function
describe('geocodeByAddress', () => {
  it('should be true', () => {
    expect(true).to.be.true
  })
})
