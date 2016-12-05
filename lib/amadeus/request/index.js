"use strict";

var requests = {};
var AmadeusResponse = require('../response');
var Promise = require('bluebird');
var soap = Promise.promisifyAll(require('soap'));
var _ = require('lodash');

requests.Security_Authenticate = require('./security_authenticate');
requests.Security_SignOut = require('./security_signout');
requests.Fare_MasterPricerTravelBoardSearch = require('./fare_masterpricertravelboardsearch');

var AmadeusRequest = function(session, options) {
  this.wsdl = 'data/wsdl/amadeus.wsdl';
  this.session = session;

  _.merge(options, this);

  _.each(requests, function(handler, name) {
    this[name] = handler.bind(this);
  }, this);
};

AmadeusRequest.prototype.perform = function(method, payload) {
  return soap.createClientAsync(this.wsdl)
    .bind(this)
    .then(function(client) {
      if (this.session) {
        this.session.incrSequenceNumber();
        client.addSoapHeader(this.session.toAmadeusSessionV2(), null, 'awsse');
      }

      return new Promise(function(resolve, reject) {
        client[method](payload, function(err, result, raw, soapHeader) {
          if (err) {
            reject(err);
          } else {
            resolve(AmadeusResponse(method, result, soapHeader));
          }
        });
      });
    });
};

module.exports = AmadeusRequest;