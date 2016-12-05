"use strict";

var responses = {};
responses.Security_Authenticate = require('./security_authenticate');
responses.Security_SignOut = require('./security_signout');
responses.Fare_MasterPricerTravelBoardSearch = require('./fare_masterpricertravelboardsearch');

var AmadeusResponse = function(method, data, headers) {
  if (!responses[method]) {
    return data;
  }

  return new responses[method](data, headers);
};

module.exports = AmadeusResponse;