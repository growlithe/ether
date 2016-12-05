"use strict";

var _ = require('lodash');

var SecurityAuthenticateResponse = function(data, headers) {
  this.data = data;
  this.headers = headers;
};

SecurityAuthenticateResponse.prototype.isSuccessful = function() {
  return _.get(this.data, 'processStatus.statusCode') === 'P';
};

SecurityAuthenticateResponse.prototype.error = function() {
  var errText = _.get(this.data, 'errorSection.interactiveFreeText.freeText');
  if (errText && _.isArray(errText)) {
    errText = errText.join(' ');
  }

  var errCode = _.get(this.data, 'errorSection.applicationError.errorDetails.errorCode');

  return 'Code: ' + errCode + "\n Description: " + errText;
};

SecurityAuthenticateResponse.prototype.sessionData = function() {
  if (this.isSuccessful()) {
    return {
      sessionId: _.get(this.headers, 'Session.SessionId'),
      sequenceNumber: _.get(this.headers, 'Session.SequenceNumber'),
      securityToken: _.get(this.headers, 'Session.SecurityToken')
    };
  }

  return false;
};

module.exports = SecurityAuthenticateResponse;