'use strict';

var _setup = require('./helpers/setup');

var _testHelpers = require('./helpers/testHelpers');

beforeAll(function () {
  (0, _setup.setupGoogleMock)();
});

describe('mouse event handlers', function () {
  test('suggesion item handles mouse enter and leave event', function () {
    var wrapper = (0, _setup.mountComponent)();
    (0, _testHelpers.simulateSearch)(wrapper);

    var suggestionItem = wrapper.find('[data-test="suggestion-item"]').first();
    suggestionItem.simulate('mouseenter');

    var _wrapper$state = wrapper.state(),
        suggestions = _wrapper$state.suggestions;

    expect(suggestions[0].active).toEqual(true);

    suggestionItem.simulate('mouseleave');
    suggestions = wrapper.state().suggestions;
    expect(suggestions[0].active).toEqual(false);
  });
});