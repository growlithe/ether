"use strict";

var Location = require('./location');
var _ = require('lodash');
var moment = require('moment');

var Itinerary = function(from, to, date) {
  if (_.isPlainObject(from)) {
    _.defaults(this, from);
  } else {
    this.from = from;
    this.to = to;
    this.date = date;
  }

  if (_.isString(this.from)) {
    this.from = new Location(this.from);
  }

  if (_.isString(this.to)) {
    this.to = new Location(this.to);
  }  

  this.date = moment(this.date, 'DDMMYY');
};

Itinerary.prototype.isValid = function() {
  return this.date.isValid() && this.from.isValid() && this.to.isValid();
};

module.exports = Itinerary;