'use strict';

var _setup = require('./helpers/setup');

var _testHelpers = require('./helpers/testHelpers');

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

describe('keyboard events handlers', function () {
  test('pressing ArrowDown key will make the first suggestion active', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' });

    var _wrapper$state = wrapper.state(),
        suggestions = _wrapper$state.suggestions;

    expect(suggestions[0].active).toEqual(true);
  });

  test('pressing ArrowUp key will make the last suggestion active', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowUp' });

    var _wrapper$state2 = wrapper.state(),
        suggestions = _wrapper$state2.suggestions;

    expect(suggestions[suggestions.length - 1].active).toEqual(true);
  });

  test('pressing ArrowUp/ArrowDown will make activate correct suggestion item', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' }); // index 0 active
    input.simulate('keydown', { key: 'ArrowDown' }); // index 1 active
    input.simulate('keydown', { key: 'ArrowDown' }); // index 2 active
    input.simulate('keydown', { key: 'ArrowUp' }); // index 1 active

    var _wrapper$state3 = wrapper.state(),
        suggestions = _wrapper$state3.suggestions;

    expect(suggestions[1].active).toEqual(true);
  });

  test('wraps with ArrowDown key', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');

    var _wrapper$state4 = wrapper.state(),
        suggestions = _wrapper$state4.suggestions;

    for (var i = 0; i < suggestions.length; i++) {
      input.simulate('keydown', { key: 'ArrowDown' });
    }
    suggestions = wrapper.state().suggestions;
    expect(suggestions[suggestions.length - 1].active).toEqual(true);

    input.simulate('keydown', { key: 'ArrowDown' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions.find(function (s) {
      return s.active;
    })).toBeUndefined();

    input.simulate('keydown', { key: 'ArrowDown' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions[0].active).toEqual(true);
  });

  test('wraps with ArrowUp key', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');

    var _wrapper$state5 = wrapper.state(),
        suggestions = _wrapper$state5.suggestions;

    for (var i = 0; i < suggestions.length; i++) {
      input.simulate('keydown', { key: 'ArrowUp' });
    }
    suggestions = wrapper.state().suggestions;
    expect(suggestions[0].active).toEqual(true);

    input.simulate('keydown', { key: 'ArrowUp' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions.find(function (s) {
      return s.active;
    })).toBeUndefined();

    input.simulate('keydown', { key: 'ArrowUp' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions[suggestions.length - 1].active).toEqual(true);
  });

  test('pressing ESC key will clear suggestions', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'Escape' });

    var _wrapper$state6 = wrapper.state(),
        suggestions = _wrapper$state6.suggestions;

    expect(suggestions.length).toEqual(0);
  });

  test('pressing Enter key will clear suggestions', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var input = wrapper.find('input');
    input.simulate('keydown', { key: 'Enter' });

    var _wrapper$state7 = wrapper.state(),
        suggestions = _wrapper$state7.suggestions;

    expect(suggestions.length).toEqual(0);
  });
});