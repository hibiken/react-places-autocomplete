import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { renderComponent, expect } from './testHelper'
import PlacesAutocomplete, { geocodeByAddress } from '../index.js'

describe('PlacesAutocomplete', () => {
  it('should have fieldset as the root element', () => {
    const renderer = TestUtils.createRenderer()
    renderer.render(<PlacesAutocomplete value="San Francisco, CA" setAddress={() => {}} />)
    const actual = renderer.getRenderOutput().type
    const expected = 'fieldset'
    expect(actual).to.equal(expected)
  })

  it('should have custom classNames', () => {
    const cssClasses = {
      container: 'my-container',
      label: 'my-label',
    }
    const renderer = TestUtils.createRenderer()
    renderer.render(<PlacesAutocomplete
                      value="New York, NY"
                      setAddress={() => {}}
                      classNames={cssClasses}
                    />)
    const actual = renderer.getRenderOutput().props.className
    const expected = 'my-container'
    expect(actual).to.equal(expected)
  })
})


// TODO: test geocodeByAddress function
describe('geocodeByAddress', () => {
  it('should be true', () => {
    expect(true).to.be.true
  })
})
