"use strict";

var AmadeusRequest = require('./request');
var Pool = require('./session/pool');
var Promise = require('bluebird');
var logger = require('winston');

var Amadeus = function() {
  this.pool = new Pool();
};

Amadeus.prototype.search = function(flow) {
  var sessionKeeper = null;
  var self = this;

  var sessionDisposer = function() {
    return this.pool.aquire()
      .then(function(session) {
        sessionKeeper = session;
        logger.info('Session aquired #' + session.sessionId);
        return new AmadeusRequest(session);
      })
      .disposer(function() {
        if (sessionKeeper) {
          logger.info('Session released #' + sessionKeeper.sessionId);
          self.pool.release(sessionKeeper);
        }
      });
  };
  return Promise.using(sessionDisposer.bind(this)(), flow);
};

module.exports = new Amadeus();
