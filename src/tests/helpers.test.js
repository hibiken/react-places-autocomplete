import { compose, pick } from '../helpers';

describe('pick', () => {
  it('picks properties from object', () => {
    const object = { one: 1, two: 2, three: 3 };
    const result = pick(object, 'one', 'three');
    expect(result).toEqual({ one: 1, three: 3 });
  });

  it('picks only properties with value', () => {
    const object = { one: 1, two: 2, three: 3 };
    const result = pick(object, 'one', 'four');
    expect(result).toEqual({ one: 1 });
  });

  it('does not mutate the original object', () => {
    const object = { one: 1, two: 2, three: 3 };
    pick(object, 'one', 'three');
    expect(object).toEqual({ one: 1, two: 2, three: 3 });
  });

  it('works for function properties', () => {
    const clickHandler = () => {
      alert('clicked');
    };
    const mouseEnterHandler = () => {
      alert('mouseenter');
    };
    const mouseLeaveHandler = () => {
      alert('mouseleave');
    };
    const object = {
      onClick: clickHandler,
      onMouseEnter: mouseEnterHandler,
      onMouseLeave: mouseLeaveHandler,
    };
    const result = pick(object, 'onClick');
    expect(result).toEqual({
      onClick: clickHandler,
    });
  });
});

describe('compose', () => {
  it('returns composed function', () => {
    const func1 = jest.fn();
    const func2 = jest.fn();
    const composedFunc = compose(func1, func2);
    composedFunc('one');

    expect(func1.mock.calls.length).toBe(1);
    expect(func2.mock.calls.length).toBe(1);
    expect(func1).toBeCalledWith('one');
    expect(func2).toBeCalledWith('one');
  });

  it('with multiple functions and arguments', () => {
    const func1 = jest.fn();
    const func2 = jest.fn();
    const func3 = jest.fn();
    const composedFunc = compose(func1, func2, func3);
    composedFunc('one', 'two');

    expect(func1.mock.calls.length).toBe(1);
    expect(func2.mock.calls.length).toBe(1);
    expect(func3.mock.calls.length).toBe(1);
    expect(func1).toBeCalledWith('one', 'two');
    expect(func2).toBeCalledWith('one', 'two');
    expect(func3).toBeCalledWith('one', 'two');
  });
});
