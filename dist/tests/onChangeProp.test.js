'use strict';

var _setup = require('./helpers/setup');

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

describe('onChange prop', function () {
  it('handles user typing in input field', function () {
    var onChangeHandler = jest.fn();
    var wrapper = (0, _setup.mountComponent)({
      value: '',
      onChange: onChangeHandler
    });
    var input = wrapper.find('input');
    input.simulate('change', { target: { value: 's' } });
    expect(onChangeHandler).toHaveBeenCalledTimes(1);
    expect(onChangeHandler).toBeCalledWith('s');
  });

  it('handles user pasting multiple characters in input field', function () {
    var onChangeHandler = jest.fn();
    var wrapper = (0, _setup.mountComponent)({
      value: '',
      onChange: onChangeHandler
    });
    var input = wrapper.find('input');
    // simulate pasting
    input.simulate('change', { target: { value: 'New York' } });
    expect(onChangeHandler).toHaveBeenCalledTimes(1);
    expect(onChangeHandler).toBeCalledWith('New York');
  });
});