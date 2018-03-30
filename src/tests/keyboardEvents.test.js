import { mountComponent, setupGoogleMock } from './helpers/setup';
import { simulateSearch } from './helpers/testHelpers';

beforeAll(() => {
  setupGoogleMock();
});

describe('keyboard events handlers', () => {
  it('handles ArrowDown key', () => {
    const wrapper = mountComponent({
      value: '',
      onChange: () => {},
    });
    simulateSearch(wrapper);

    const input = wrapper.find('input');
    input.simulate('keydown', { key: 'ArrowDown' });
    const { suggestions } = wrapper.state();
    expect(suggestions[0].active).toEqual(true);
  });

  // TODO: handler ArrowUp

  // TODO: handle ESC key

  // TODO: handle Enter key

  // TODO: handle Tab key
});
