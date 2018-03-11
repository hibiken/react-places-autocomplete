import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from '../../src/tests/testHelper';
import PlacesAutocomplete, { geocodeByAddress } from '../../src';
import Demo from '../Demo';

describe('<Demo />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Demo />);
  });

  it('renders a PlacesAutocomplete component', () => {
    expect(wrapper.find(PlacesAutocomplete)).to.exist;
  });

  it('sets the value prop of the input element to state.address', () => {
    const wrapper = mount(<Demo />);
    wrapper.setState({ address: '123 Fake St' });
    expect(wrapper.find(PlacesAutocomplete).props().value).to.equal(
      '123 Fake St'
    );
  });

  it('renders loading animation when state.loading is true', () => {
    wrapper.setState({ loading: true });
    expect(wrapper.find('.loader')).to.exist;
  });

  it("doesn't initially render geocoding results", () => {
    expect(wrapper.find('.geocoding-results')).to.not.exist;
  });

  it('renders geocoding results when state.geocodeResults has value', () => {
    wrapper.setState({
      geocodeResults: () => wrapper.instance.renderGeocodeSuccess(123, 456),
    });
    expect(wrapper.find('.geocoding-results')).to.exist;
  });
});
