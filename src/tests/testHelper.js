import React from 'react';
import jsdom from 'jsdom';
import jquery from 'jquery';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import chai, { expect } from 'chai';
import chaiJquery from 'chai-jquery';

/*** Set up testing environment to run like a browser in Node ***/
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
const $ = jquery(global.window);

/*** renderComponent helper ***/
const renderComponent = (jsx) => {
  const componentInstance = TestUtils.renderIntoDocument(jsx);
  return $(ReactDOM.findDOMNode(componentInstance)); // jQuery enhance version of the component Node
};

/*** Helper for simulating events ***/
$.fn.simulate = function(eventName, value) {
  if (value) {
    this.val(value);
  }
  TestUtils.Simulate[eventName](this[0]);
}

/*** Set up chai-jquery ***/
chaiJquery(chai, chai.util, $);

export {
  renderComponent,
  expect,
}
