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
    wrapper = shallow(<PlacesAutocomplete value="San Francisco, CA" onChange={() => {}} />)
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
    const wrapper = mount(<PlacesAutocomplete value="San Francisco, Ca" onChange={() => {}} />)
    expect(PlacesAutocomplete.prototype.componentDidMount.calledOnce).to.equal(true)
  })
});

describe('PlacesAutocomplete props', () => {
  it('allows user to set the value of the input through prop', () => {
    const wrapper = mount(<PlacesAutocomplete value="San Francisco, CA" onChange={() => {}} />)
    expect(wrapper.find('input').props().value).to.equal("San Francisco, CA")
  })
});

describe('autocomplete dropdown', () => {
  let wrapper;
  const autocompleteItem = ({ suggestion }) => (<div className="autocomplete-item">{suggestion}</div>)
  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete value="San Francisco, CA" onChange={() => {}} autocompleteItem={autocompleteItem} />)
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
    expect(wrapper.find('.autocomplete-item')).to.have.length(3)
  })
})

describe('custom classNames, placeholder', () => {
  const classNames = {
    root: 'my-container',
    label: 'my-label',
    input: 'my-input',
    autocompleteContainer: 'my-autocomplete-container'
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete
                        value="San Francisco, CA"
                        onChange={() => {}}
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
    expect(wrapper.find('input').props().placeholder).to.equal('Your Address')
  })
});

describe('hideLabel prop', () => {
  it('lets you hide label element', () => {
    const wrapper = shallow(<PlacesAutocomplete value="New York, NY" onChange={() => {}} hideLabel={true} />)
    expect(wrapper.find('label')).to.have.length(0)
  })
});

describe('customizable autocompleteItem', () => {
  it('lets you provide a custom autocomplete item', () => {
    const autocompleteItem = ({ suggestion }) => (<div className="my-autocomplete-item"><i className="fa fa-map-marker"/></div>)
    const wrapper = shallow(<PlacesAutocomplete value="LA" onChange={() => {}} autocompleteItem={autocompleteItem}/>)
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: false, index: 0 }] })
    expect(wrapper.find('.my-autocomplete-item')).to.have.length(1)
    expect(wrapper.find('.my-autocomplete-item')).to.contain(<i className="fa fa-map-marker"/>)
  })
})


// TODO: test geocodeByAddress function
describe('geocodeByAddress', () => {
  it('should be true', () => {
    expect(true).to.be.true
  })
})
