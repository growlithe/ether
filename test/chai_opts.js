"use strict";

global.chai = require('chai');
global.sinon = require('sinon');
global.chai.use(require('chai-http'));
global.chai.use(require('chai-subset'));
global.chai.use(require('chai-as-promised'));
global.chai.use(require('sinon-chai'));

global.should = require('chai').should();
global.expect = require('chai').expect;
global.AssertionError = require('chai').AssertionError;

if (!global.Promise) {
  var Promise = require('bluebird');
  global.chai.request.addPromises(Promise);
}