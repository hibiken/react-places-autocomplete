import { mountComponent, setupGoogleMock } from './helpers/setup';

beforeAll(() => {
  setupGoogleMock();
});

describe('onChange prop', () => {
  it('handles user typing in input field', () => {
    const onChangeHandler = jest.fn();
    const wrapper = mountComponent({
      value: '',
      onChange: onChangeHandler,
    });
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 's' } });
    expect(onChangeHandler).toHaveBeenCalledTimes(1);
    expect(onChangeHandler).toBeCalledWith('s');
  });

  it('handles user pasting multiple characters in input field', () => {
    const onChangeHandler = jest.fn();
    const wrapper = mountComponent({
      value: '',
      onChange: onChangeHandler,
    });
    const input = wrapper.find('input');
    // simulate pasting
    input.simulate('change', { target: { value: 'New York' } });
    expect(onChangeHandler).toHaveBeenCalledTimes(1);
    expect(onChangeHandler).toBeCalledWith('New York');
  });
});
