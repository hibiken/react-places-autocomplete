import { mountComponent, setupGoogleMock } from './helpers/setup';
import { simulateSearch, mockSuggestions } from './helpers/testHelpers';

beforeAll(() => {
  setupGoogleMock();
});

describe('onSelect prop', () => {
  test('click on suggestion item will call onSelect handler', () => {
    const onSelectHandler = jest.fn();
    const wrapper = mountComponent({ onSelect: onSelectHandler });
    simulateSearch(wrapper);

    const suggestionItem = wrapper
      .find('[data-test="suggestion-item"]')
      .first();
    suggestionItem.simulate('click');
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
  });

  test('pressing Enter key will call onSelect handler', () => {
    const onSelectHandler = jest.fn();
    const wrapper = mountComponent({
      value: 'San Francisco',
      onSelect: onSelectHandler,
    });

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'Enter' });
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
    // first argument is input value,
    // second argument is placeId, null in this case.
    expect(onSelectHandler).toBeCalledWith('San Francisco', null, null);
  });

  test('pressing Enter when one of the suggestion items is active', () => {
    const onSelectHandler = jest.fn();
    const wrapper = mountComponent({
      onSelect: onSelectHandler,
    });
    simulateSearch(wrapper); // suggestions state is populated by mockSuggestions

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' }); // index 0 active
    input.simulate('keydown', { key: 'Enter' });
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
    expect(onSelectHandler).toBeCalledWith(
      mockSuggestions[0].description,
      mockSuggestions[0].placeId,
      mockSuggestions[0].formattedSuggestion.mainText
    );
  });

  test('pressing Enter when mouse hovers over one of the suggestion items', () => {
    const onSelectHandler = jest.fn();
    const wrapper = mountComponent({
      onSelect: onSelectHandler,
    });
    simulateSearch(wrapper);

    const suggestionItem = wrapper
      .find('[data-test="suggestion-item"]')
      .first();
    const input = wrapper.find('input');
    suggestionItem.simulate('mouseenter');
    input.simulate('keydown', { key: 'Enter' });
    expect(onSelectHandler).toHaveBeenCalledTimes(1);
    expect(onSelectHandler).toBeCalledWith(
      mockSuggestions[0].description,
      mockSuggestions[0].placeId,
      mockSuggestions[0].formattedSuggestion.mainText
    );
  });
});
