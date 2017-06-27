import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'
import { expect } from './testHelper'
import PlacesAutocomplete, { geocodeByAddress } from '../index.js'

const testInputProps = {
  value: "San Francisco, CA",
  onChange: () => {},
}

/*** Enzyme Rocks ***/
describe('<PlacesAutocomplete />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete inputProps={testInputProps} />)
  })

  it('renders an input element', () => {
    expect(wrapper.find('input')).to.have.length(1)
  })
});

// TODO: What's the value of this test?
describe('PlacesAutocomplete callbacks', () => {
  it('executes onError callback passed in as prop when status is not OK', () => {
    const spy = sinon.spy()
    const wrapper = mount(<PlacesAutocomplete onError={spy} inputProps={testInputProps} />)
    wrapper.instance().autocompleteCallback([], 'ZERO_RESULTS')
    expect(spy.calledOnce).to.equal(true)
    expect(spy.calledWith('ZERO_RESULTS')).to.equal(true)
  })

  it('executes default onError function when there is no custom prop and status is not OK', () => {
    sinon.stub(console, 'error')
    const wrapper = mount(<PlacesAutocomplete inputProps={testInputProps} />)
    wrapper.instance().autocompleteCallback([], 'ZERO_RESULTS')
    expect(console.error.calledOnce).to.equal(true)
  })
});

describe('PlacesAutocomplete props', () => {
  it('allows user to set the value of the input through prop', () => {
    const inputProps = {
      ...testInputProps,
      value: "New York, NY",
    }

    const wrapper = mount(<PlacesAutocomplete inputProps={inputProps} />)
    expect(wrapper.find('input').props().value).to.equal("New York, NY")
  })
});

describe('autocomplete dropdown', () => {
  let wrapper;
  const autocompleteItem = ({ suggestion }) => (<div className="autocomplete-item">{suggestion}</div>)
  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete inputProps={testInputProps} autocompleteItem={autocompleteItem} />)
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

  it('clears the autocomplete items when PlacesServiceStatus is not OK and clearItemsOnError prop is true', () => {
    const initialItems = [{
        suggestion: 'San Francisco, CA',
        placeId: 1,
        active: false,
        index: 0
    }]
    const wrapper = shallow(<PlacesAutocomplete inputProps={testInputProps} clearItemsOnError={true}/>)
    wrapper.setState({ autocompleteItems: initialItems })
    wrapper.instance().autocompleteCallback([], 'ZERO_RESULTS')
    expect(wrapper.find('.autocomplete-item')).to.have.length(0)
  })

  it('does not clear the autocomplete items when PlacesServiceStatus is not OK and clearItemsOnError prop is false', () => {
    const initialItems = [{
        suggestion: 'San Francisco, CA',
        placeId: 1,
        active: false,
        index: 0
    }]
    wrapper.setState({ autocompleteItems: initialItems })
    wrapper.instance().autocompleteCallback([], 'ZERO_RESULTS')
    expect(wrapper.find('.autocomplete-item')).to.have.length(1)
  })
})

describe('custom classNames, placeholder', () => {
  const inputProps = {
    ...testInputProps,
    placeholder: "Your Address",
  }

  const classNames = {
    root: 'my-container',
    input: 'my-input',
    autocompleteContainer: 'my-autocomplete-container'
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlacesAutocomplete inputProps={inputProps} classNames={classNames} />)
  })

  it('lets you set a custom className for the container', () => {
    expect(wrapper.find('.my-container')).to.have.length(1)
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

// TODO: test formattedSuggestion
describe('customizable autocompleteItem', () => {
  it('lets you provide a custom autocomplete item', () => {
    const autocompleteItem = ({ suggestion }) => (<div className="my-autocomplete-item"><i className="fa fa-map-marker"/></div>)
    const wrapper = shallow(<PlacesAutocomplete inputProps={testInputProps} autocompleteItem={autocompleteItem}/>)
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: false, index: 0 }] })
    expect(wrapper.find('.my-autocomplete-item')).to.have.length(1)
    expect(wrapper.find('.my-autocomplete-item')).to.contain(<i className="fa fa-map-marker"/>)
  })
})

describe('custom inline styles', () => {
  const styles = {
    root: { position: 'absolute' },
    input: { width: '100%' },
    autocompleteContainer: { backgroundColor: 'green' },
    autocompleteItem: { color: 'black' },
    autocompleteItemActive: { color: 'blue' }
  }

  let wrapper;
  beforeEach(() => {

    wrapper = shallow(<PlacesAutocomplete inputProps={testInputProps} styles={styles} />)
  })

  it('lets you set custom styles for the root element', () => {
    expect(wrapper.find('#PlacesAutocomplete__root').props().style.position).to.equal('absolute')
  })

  it('lets you set custom styles for the input element', () => {
    expect(wrapper.find('input').props().style.width).to.equal('100%')
  })

  it('lets you set custom styles for the autocomplete container element', () => {
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: false, index: 0 }] })
    expect(wrapper.find('#PlacesAutocomplete__autocomplete-container').props().style.backgroundColor).to.equal('green')
  })

  it('lets you set custom styles for autocomplete items', () => {
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: false, index: 0 }] })
    const item = wrapper.find("#PlacesAutocomplete__autocomplete-container").childAt(0)
    expect(item.props().style.color).to.equal('black')
  })

  it('lets you set custom styles for active autocomplete items', () => {
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: true, index: 0 }] })
    const item = wrapper.find("#PlacesAutocomplete__autocomplete-container").childAt(0)
    expect(item.props().style.color).to.equal('blue')
  })
})

 describe('AutocompletionRequest options', () => {
   const inputProps = {
     ...testInputProps,
     value: 'Boston, MA',
   }
   it('calls getPlacePredictions with the correct options', (done) => {
     global.google.maps.places.AutocompleteService.prototype.getPlacePredictions = (request, callback) => {}
     const spy = sinon.spy(global.google.maps.places.AutocompleteService.prototype, 'getPlacePredictions')
     const options = { radius: 2000, types: ['address'] }
     const wrapper = mount(<PlacesAutocomplete inputProps={inputProps} options={options} />)
     wrapper.find('input').simulate('change', { target: { value: 'Los Angeles, CA' } })
     setTimeout(() => {
       done()
       expect(spy.calledWith({ ...options, input: 'Los Angeles, CA' })).to.be.true
     }, 0)
   })
 })

describe('autoFocus prop', () => {
  const inputProps = {
    ...testInputProps,
    autoFocus: true,
  }

  it('automatically gives focus when set to true', () => {
    const wrapper = mount(<PlacesAutocomplete inputProps={inputProps} />)
    expect(wrapper.find('input').node).to.equal(document.activeElement)
  })

  it('does not give the input element a focus by default', () => {
    const wrapper = mount(<PlacesAutocomplete inputProps={testInputProps} />)
    expect(wrapper.find('input').node).to.not.equal(document.activeElement)
  })
})

// TODOs:
// * Test geocodeByAddress function
