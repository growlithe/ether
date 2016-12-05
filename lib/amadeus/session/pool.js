"use strict";

var Request = require('../request');
var Store = require('./store/redis');
var Session = require('./session');
var logger = require('winston');

var AmadeusSessionPool = function() {
  this.POOL_SIZE = 200;
  this.ERR_THRESHOLD = 5;
  this.errorCount = 0;

  this.request = new Request();
  this.store = new Store();
};

AmadeusSessionPool.prototype.aquire = function() {
  return this.store.pop()
    .bind(this)
    .then(function(sessionData) {
      return new Session(sessionData);
    })
    .catch(function(err) {
      this.errorCount++;

      if (this.errorCount > this.ERR_THRESHOLD) {
        throw new Error('Cannot allocate new session');
      }

      return this.allocate()
        .bind(this)
        .then(function(session) {
          this.store.push(session);
          return this.aquire();
        })
        .catch(function() {
          return this.aquire();
        });
    });
};

AmadeusSessionPool.prototype.allocate = function() {
  return this.request.Security_Authenticate()
    .bind(this)
    .then(function(response) {
      if (!response.isSuccessful()) {
        console.log(response.error());
        throw new Error('Bad session');
      }

      this.errorCount = 0;
      logger.info('Allocated session #' + response.sessionData().sessionId);
      return new Session(response.sessionData());
    });
};

AmadeusSessionPool.prototype.deallocate = function(sessionData) {
  logger.info('Deallocating session #' + sessionData.sessionId);
  var request = new Request(new Session(sessionData));
  return request.Security_SignOut();
};

AmadeusSessionPool.prototype.release = function(session) {
  logger.info('Releasing session #' + session.sessionId);
  return this.store.push(session);
};

AmadeusSessionPool.prototype.clean = function() {
  return this.store.clean(this.deallocate);
};



module.exports = AmadeusSessionPool;