'use strict';

// Register babel so that it will transpile ES6 to ES5
// before our tests run.
require('babel-register')();

var Enzyme = require('enzyme');
var Adapter = require('enzyme-adapter-react-16');
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });