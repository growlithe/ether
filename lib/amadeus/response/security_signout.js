"use strict";

var _ = require('lodash');
var Session = require('../session/session');

var SecuritySignOutResponse = function(data, headers) {
  this.data = data;
  this.headers = headers;
};

SecuritySignOutResponse.prototype.isSuccessful = function() {
  return _.get(this.data, 'processStatus.statusCode') === 'P';
};

module.exports = SecuritySignOutResponse;