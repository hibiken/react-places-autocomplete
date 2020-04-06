'use strict';

var _helpers = require('../helpers');

describe('pick', function () {
  it('picks properties from object', function () {
    var object = { one: 1, two: 2, three: 3 };
    var result = (0, _helpers.pick)(object, 'one', 'three');
    expect(result).toEqual({ one: 1, three: 3 });
  });

  it('picks only properties with value', function () {
    var object = { one: 1, two: 2, three: 3 };
    var result = (0, _helpers.pick)(object, 'one', 'four');
    expect(result).toEqual({ one: 1 });
  });

  it('does not mutate the original object', function () {
    var object = { one: 1, two: 2, three: 3 };
    (0, _helpers.pick)(object, 'one', 'three');
    expect(object).toEqual({ one: 1, two: 2, three: 3 });
  });

  it('works for function properties', function () {
    var clickHandler = function clickHandler() {
      alert('clicked');
    };
    var mouseEnterHandler = function mouseEnterHandler() {
      alert('mouseenter');
    };
    var mouseLeaveHandler = function mouseLeaveHandler() {
      alert('mouseleave');
    };
    var object = {
      onClick: clickHandler,
      onMouseEnter: mouseEnterHandler,
      onMouseLeave: mouseLeaveHandler
    };
    var result = (0, _helpers.pick)(object, 'onClick');
    expect(result).toEqual({
      onClick: clickHandler
    });
  });
});

describe('compose', function () {
  it('returns composed function', function () {
    var func1 = jest.fn();
    var func2 = jest.fn();
    var composedFunc = (0, _helpers.compose)(func1, func2);
    composedFunc('one');

    expect(func1.mock.calls.length).toBe(1);
    expect(func2.mock.calls.length).toBe(1);
    expect(func1).toBeCalledWith('one');
    expect(func2).toBeCalledWith('one');
  });

  it('with multiple functions and arguments', function () {
    var func1 = jest.fn();
    var func2 = jest.fn();
    var func3 = jest.fn();
    var composedFunc = (0, _helpers.compose)(func1, func2, func3);
    composedFunc('one', 'two');

    expect(func1.mock.calls.length).toBe(1);
    expect(func2.mock.calls.length).toBe(1);
    expect(func3.mock.calls.length).toBe(1);
    expect(func1).toBeCalledWith('one', 'two');
    expect(func2).toBeCalledWith('one', 'two');
    expect(func3).toBeCalledWith('one', 'two');
  });
});