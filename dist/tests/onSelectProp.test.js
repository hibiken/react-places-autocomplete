'use strict';

var _setup = require('./helpers/setup');

var _testHelpers = require('./helpers/testHelpers');

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

describe('onSelect prop', function () {
  test('click on suggestion item will call onSelect handler', function () {
    var onSelectHandler = jest.fn();
    var wrapper = (0, _setup.mountComponent)({ onSelect: onSelectHandler });
    (0, _testHelpers.simulateSearch)(wrapper);

    var suggestionItem = wrapper.find('[data-test="suggestion-item"]').first();
    suggestionItem.simulate('click');
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
  });

  test('pressing Enter key will call onSelect handler', function () {
    var onSelectHandler = jest.fn();
    var wrapper = (0, _setup.mountComponent)({
      value: 'San Francisco',
      onSelect: onSelectHandler
    });

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'Enter' });
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
    // first argument is input value,
    // second argument is placeId, null in this case.
    expect(onSelectHandler).toBeCalledWith('San Francisco', null);
  });

  test('pressing Enter when one of the suggestion items is active', function () {
    var onSelectHandler = jest.fn();
    var wrapper = (0, _setup.mountComponent)({
      onSelect: onSelectHandler
    });
    (0, _testHelpers.simulateSearch)(wrapper); // suggestions state is populated by mockSuggestions

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' }); // index 0 active
    input.simulate('keydown', { key: 'Enter' });
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
    expect(onSelectHandler).toBeCalledWith(_testHelpers.mockSuggestions[0].description, _testHelpers.mockSuggestions[0].placeId);
  });

  test('pressing Enter when mouse hovers over one of the suggestion items', function () {
    var onSelectHandler = jest.fn();
    var wrapper = (0, _setup.mountComponent)({
      onSelect: onSelectHandler
    });
    (0, _testHelpers.simulateSearch)(wrapper);

    var suggestionItem = wrapper.find('[data-test="suggestion-item"]').first();
    var input = wrapper.find('input');
    suggestionItem.simulate('mouseenter');
    input.simulate('keydown', { key: 'Enter' });
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
    expect(onSelectHandler).toBeCalledWith(_testHelpers.mockSuggestions[0].description, _testHelpers.mockSuggestions[0].placeId);
  });
});