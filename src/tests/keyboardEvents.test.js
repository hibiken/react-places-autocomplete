import { mountComponent, setupGoogleMock } from './helpers/setup';
import { simulateSearch } from './helpers/testHelpers';

beforeAll(() => {
  setupGoogleMock();
});

describe('keyboard events handlers', () => {
  test('pressing ArrowDown key will make the first suggestion active', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' });
    const { suggestions } = wrapper.state();
    expect(suggestions[0].active).toEqual(true);
  });

  test('pressing ArrowUp key will make the last suggestion active', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowUp' });
    const { suggestions } = wrapper.state();
    expect(suggestions[suggestions.length - 1].active).toEqual(true);
  });

  test('pressing ArrowUp/ArrowDown will make activate correct suggestion item', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' }); // index 0 active
    input.simulate('keydown', { key: 'ArrowDown' }); // index 1 active
    input.simulate('keydown', { key: 'ArrowDown' }); // index 2 active
    input.simulate('keydown', { key: 'ArrowUp' }); // index 1 active
    const { suggestions } = wrapper.state();
    expect(suggestions[1].active).toEqual(true);
  });

  test('wraps with ArrowDown key', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    let { suggestions } = wrapper.state();
    for (let i = 0; i < suggestions.length; i++) {
      input.simulate('keydown', { key: 'ArrowDown' });
    }
    suggestions = wrapper.state().suggestions;
    expect(suggestions[suggestions.length - 1].active).toEqual(true);

    input.simulate('keydown', { key: 'ArrowDown' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions.find(s => s.active)).toBeUndefined();

    input.simulate('keydown', { key: 'ArrowDown' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions[0].active).toEqual(true);
  });

  test('wraps with ArrowUp key', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    let { suggestions } = wrapper.state();
    for (let i = 0; i < suggestions.length; i++) {
      input.simulate('keydown', { key: 'ArrowUp' });
    }
    suggestions = wrapper.state().suggestions;
    expect(suggestions[0].active).toEqual(true);

    input.simulate('keydown', { key: 'ArrowUp' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions.find(s => s.active)).toBeUndefined();

    input.simulate('keydown', { key: 'ArrowUp' });
    suggestions = wrapper.state().suggestions;
    expect(suggestions[suggestions.length - 1].active).toEqual(true);
  });

  test('pressing ESC key will clear suggestions', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'Escape' });
    const { suggestions } = wrapper.state();
    expect(suggestions.length).toEqual(0);
  });

  test('pressing Enter key will clear suggestions', () => {
    const wrapper = mountComponent();
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'Enter' });
    const { suggestions } = wrapper.state();
    expect(suggestions.length).toEqual(0);
  });
});
