import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import { expect } from './testHelper'
import PlacesAutocomplete, { geocodeByAddress } from '../index.js'

/*** Enzyme Rocks ***/
describe('<PlacesAutocomplete />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete value="San Francisco, CA" setAddress={() => {}} />)
  })

  it('renders an input element', () => {
    expect(wrapper.find('input')).to.have.length(1)
  })

  it('renderes an label element', () => {
    expect(wrapper.find('label')).to.have.length(1)
  })
});

describe('PlacesAutocomplete callbacks', () => {
  it('calls componentDidMount', () => {
    sinon.spy(PlacesAutocomplete.prototype, 'componentDidMount')
    const wrapper = mount(<PlacesAutocomplete value="San Francisco, Ca" setAddress={() => {}} />)
    expect(PlacesAutocomplete.prototype.componentDidMount.calledOnce).to.equal(true)
  })
});

describe('PlacesAutocomplete props', () => {
  it('allows user to set the value of the input through prop', () => {
    const wrapper = mount(<PlacesAutocomplete value="San Francisco, CA" setAddress={() => {}} />)
    expect(wrapper.find('input').props().value).to.equal("San Francisco, CA")
  })
});

describe('autocomplete dropdown', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete value="San Francisco, CA" setAddress={() => {}} />)
  })

  it('initially does not have an autocomplete dropdown', () => {
    expect(wrapper.find('#PlacesAutocomplete__autocomplete-container')).to.have.length(0)
  })

  it('renders autocomplete dropdown once it receives data from google maps', () => {
    const data = [
      {
        suggestion: 'San Francisco, CA',
        placeId: 1,
        active: false,
        index: 0
      },
      {
        suggestion: 'San Jose, CA',
        placeId: 2,
        active: false,
        index: 1
      },
      {
        suggestion: 'San Diego, CA',
        placeId: 3,
        active: false,
        index: 2
      }
    ]
    wrapper.setState({ autocompleteItems: data })
    expect(wrapper.find('#PlacesAutocomplete__autocomplete-container')).to.have.length(1)
    expect(wrapper.find('.autocomplete__item')).to.have.length(3)
  })
})

describe('custom classNames, placeholder', () => {
  const classNames = {
    container: 'my-container',
    label: 'my-label',
    input: 'my-input',
    autocompleteContainer: 'my-autocomplete-container'
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete
                        value="San Francisco, CA"
                        setAddress={() => {}}
                        classNames={classNames}
                        placeholder="Your Address"
                      />)
  })

  it('lets you set a custom className for the container', () => {
    expect(wrapper.find('.my-container')).to.have.length(1)
  })

  it('lets you set a custom className for the label', () => {
    expect(wrapper.find('label')).to.have.className('my-label')
  })

  it('lets you set a custom className for the input', () => {
    expect(wrapper.find('input')).to.have.className('my-input')
  })

  it('lets you set a custom className for autocomplete container', () => {
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: false, index: 0 }] })
    expect(wrapper.find('#PlacesAutocomplete__autocomplete-container')).to.have.className('my-autocomplete-container')
  })

  it('lets you set a custom placeholder for the input', () => {
    //console.log(wrapper.find('input').props().placeholder)
    expect(wrapper.find('input').props().placeholder).to.equal('Your Address')
  })
});

















// TODO: test geocodeByAddress function
describe('geocodeByAddress', () => {
  it('should be true', () => {
    expect(true).to.be.true
  })
})
