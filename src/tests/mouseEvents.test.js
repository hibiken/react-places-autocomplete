import { mountComponent, setupGoogleMock } from './helpers/setup';
import { simulateSearch } from './helpers/testHelpers';

beforeAll(() => {
  setupGoogleMock();
});

describe('mouse event handlers', () => {
  test('suggestion item handles mouse enter and leave event', () => {
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

  test('suggestion item should have a unique id on mouse enter', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    wrapper.find('[data-test="suggestion-item"]').forEach(suggestion => {
      const suggestionId = suggestion.prop('id');
      expect(wrapper.find(`#${suggestionId}`).length).toBe(1);
    });
  });
});
