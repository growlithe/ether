"use strict";

var handler = function() {
  var name = 'Security_SignOut';
  var payload = {};

  return this.perform(name, payload);
};

module.exports = handler;