"use strict";

var Itinerary = require('./search/itinerary');
var Passengers = require('./search/passengers');
var _ = require('lodash');
var moment = require('moment');

var FlightSearch = function(itineraries, passengers) {
  this.itineraries = itineraries;
  this.passengers = passengers;
};

FlightSearch.fromApi = function(data) {
  var itineraries = [];
  var passengers;

  if (data.itinerary && _.isArray(data.itinerary)) {
    _.each(data.itinerary, function(itinerary) {
      itineraries.push(new Itinerary(itinerary));
    });
  } else {
    itineraries.push(new Itinerary(data));
  }

  if (data.passenger) {
    passengers = new Passengers(data.passenger);
  } else {
    passengers = new Passengers(data);
  }

  return new FlightSearch(itineraries, passengers);
};

FlightSearch.prototype.isValid = function() {
  var valid;

  if (!_.isArray(this.itineraries) || !this.passengers) {
    return false;
  }

  if (this.itineraries.length > 3) {
    return false;
  }

  return _.map(this.itineraries.concat(this.passengers), function(item) { 
    return item.isValid(); 
  }).indexOf(false) === -1;
};

module.exports = FlightSearch;