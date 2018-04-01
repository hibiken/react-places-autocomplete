import { mountComponent, setupGoogleMock } from './helpers/setup';
import { simulateSearch } from './helpers/testHelpers';

beforeAll(() => {
  setupGoogleMock();
});

describe('mouse event handlers', () => {
  test('suggesion item handles mouse enter and leave event', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const suggestionItem = wrapper
      .find('[data-test="suggestion-item"]')
      .first();
    suggestionItem.simulate('mouseenter');
    let { suggestions } = wrapper.state();
    expect(suggestions[0].active).toEqual(true);

    suggestionItem.simulate('mouseleave');
    suggestions = wrapper.state().suggestions;
    expect(suggestions[0].active).toEqual(false);
  });
});
