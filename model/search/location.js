"use strict";

var _ = require('lodash');
var moment = require('moment');

var Location = function(iataCode) {
  this.iataCode = iataCode;

  // stub the rest, proper db needed
  this.name = iataCode;
};

Location.prototype.isValid = function() {
  return this.iataCode && this.iataCode.length === 3;
};

Location.prototype.toString = function() {
  return this.iataCode;
};

module.exports = Location;