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

  it('executes onError callback passed in as prop when status is not OK', () => {
    const spy = sinon.spy()
    const wrapper = mount(<PlacesAutocomplete onError={spy} value="San Francisco, Ca" onChange={() => {}} />)
    wrapper.instance().autocompleteCallback([], 'error')
    expect(spy.calledOnce).to.equal(true)
  })

  it('executes default onError function when there is no custom prop and status is not OK', () => {
    sinon.stub(console, 'error')
    const wrapper = mount(<PlacesAutocomplete value="San Francisco, Ca" onChange={() => {}} />)
    wrapper.instance().autocompleteCallback([], 'error')
    expect(console.error.calledOnce).to.equal(true)
    expect(console.error.calledWith('place autocomplete failed')).to.equal(true)
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

describe('custom inline styles', () => {
  let wrapper;
  beforeEach(() => {
    const styles = {
      root: { position: 'absolute' },
      label: { color: 'red' },
      input: { width: '100%' },
      autocompleteContainer: { backgroundColor: 'green' },
      autocompleteItem: { color: 'black' },
      autocompleteItemActive: { color: 'blue' }
    }
    const classNames = {
      root: 'root-element',
      label: 'label-element',
      input: 'input-element',
      autocompleteContainer: 'autocomplete-container'
    }
    wrapper = shallow(<PlacesAutocomplete styles={styles} classNames={classNames} value="LA" onChange={() => {}}/>)
  })

  it('lets you set custom styles for the root element', () => {
    expect(wrapper.find('.root-element').props().style.position).to.equal('absolute')
  })

  it('lets you set custom styles for the label element', () => {
    expect(wrapper.find('.label-element').props().style.color).to.equal('red')
  })

  it('lets you set custom styles for the input element', () => {
    expect(wrapper.find('.input-element').props().style.width).to.equal('100%')
  })

  it('lets you set custom styles for the autocomplete container element', () => {
    wrapper.setState({ autocompleteItems: [{ suggestion: 'San Francisco, CA', placeId: 1, active: false, index: 0 }] })
    expect(wrapper.find('.autocomplete-container').props().style.backgroundColor).to.equal('green')
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
  it('calls getPlacePredictions with the correct options', () => {
    global.google.maps.places.AutocompleteService.prototype.getPlacePredictions = (request, callback) => {}
    const spy = sinon.spy(global.google.maps.places.AutocompleteService.prototype, 'getPlacePredictions')
    const options = { radius: 2000, types: ['address'] }
    const wrapper = mount(<PlacesAutocomplete classNames={{ input: 'input-element' }} onChange={() => {}} options={options} value='test'/>)
    wrapper.find('.input-element').simulate('change', { target: { value: 'test' } })
    expect(spy.calledWith({ ...options, input: 'test' })).to.be.true
  })
})

describe('custom input component', () => {
  it('renders a custom input component passed as a child', () => {
    const wrapper = shallow(<PlacesAutocomplete value="LA" onChange={() => {}}><input className="test-input" type="text" onChange={() => {}}/></PlacesAutocomplete>)
    expect(wrapper.find('.test-input')).to.have.length(1)
  })

  it('adds the correct props to the child component', () => {
    const wrapper = shallow(<PlacesAutocomplete value="LA" onChange={() => {}}><input className="test-input" type="text"/></PlacesAutocomplete>)
    expect(wrapper.find('.test-input').props().onChange).to.be.defined
    expect(wrapper.find('.test-input').props().onKeyDown).to.be.defined
    expect(wrapper.find('.test-input').props().value).to.be.defined
  })

  it('correctly sets the value prop of the custom input component', () => {
    const wrapper = shallow(<PlacesAutocomplete value="LA" onChange={() => {}}><input className="test-input" type="text" onChange={() => {}}/></PlacesAutocomplete>)
    expect(wrapper.find('.test-input').props().value).to.equal('LA')
  })

  it('executes the onChange callback when the custom input is changed', () => {
    const spy = sinon.spy()
    const wrapper = shallow(<PlacesAutocomplete value="LA" onChange={spy}><input className="test-input" type="text"/></PlacesAutocomplete>)
    wrapper.find('.test-input').simulate('change', { target: { value: null } })
    expect(spy.calledOnce).to.equal(true)
  })

  it('executes handleInputKeyDown when a keyDown event happens on the custom input', () => {
    const spy = sinon.spy(PlacesAutocomplete.prototype, 'handleInputKeyDown')
    const wrapper = shallow(<PlacesAutocomplete value="LA" onChange={() => {}}><input className="test-input" type="text"/></PlacesAutocomplete>)
    wrapper.find('.test-input').simulate('keyDown', { keyCode: null })
    expect(spy.calledOnce).to.equal(true)
  })
})

describe('autoFocus prop', () => {
  it('automatically gives focus when set to true', () => {
    const wrapper = mount(<PlacesAutocomplete value="New York, NY" onChange={() => {}} autoFocus={true} />)
    expect(wrapper.find('input').node).to.equal(document.activeElement)
  })

  it('does not give the input element a focus by default', () => {
    const wrapper = mount(<PlacesAutocomplete value="New York, NY" onChange={() => {}} />)
    expect(wrapper.find('input').node).to.not.equal(document.activeElement)
  })
})

// TODO: test geocodeByAddress function
describe('geocodeByAddress', () => {
  it('should be true', () => {
    expect(true).to.be.true
  })
})
