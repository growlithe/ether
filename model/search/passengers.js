"use strict";

var _ = require('lodash');

var Passengers = function(adult, child, infant) {
  if (_.isPlainObject(adult)) {
    _.defaults(this, adult);
  }

  this.adult = parseInt(this.adult)||0;
  this.child = parseInt(this.child)||0;
  this.infant = parseInt(this.infant)||0;
};

Passengers.prototype.isValid = function() {
  if (this.adult < 1 || this.adult + this.child > 6) {
    return false;
  }

  if (this.child > this.adult) {
    return false;
  }

  if (this.infant > this.adult) {
    return false;
  }

  return true;
};

module.exports = Passengers;