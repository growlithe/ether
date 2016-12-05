"use strict";

var _ = require('lodash');

var AmadeusSession = function(sessionId, sequenceNumber, securityToken) {
  if (_.isPlainObject(sessionId)) {
    _.defaults(this, sessionId);
    this.sequenceNumber = parseInt(this.sequenceNumber);
  } else {
    this.sessionId = sessionId;
    this.sequenceNumber = parseInt(sequenceNumber);
    this.securityToken = securityToken;
  }
};

AmadeusSession.prototype.incrSequenceNumber = function() {
  this.sequenceNumber++;
};

AmadeusSession.prototype.toAmadeusSessionV2 = function() {
  return {
    Session: { 
      SessionId: this.sessionId,
      SequenceNumber: this.sequenceNumber,
      SecurityToken: this.securityToken
    }
  };
};

module.exports = AmadeusSession;