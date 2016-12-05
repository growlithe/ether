"use strict";

var Promise = require('bluebird');
var redis = Promise.promisifyAll(require('redis'));
var _ = require('lodash');
var config = require('../../../../config');

var RedisStore = function() {
  this.SESSION_LIFETIME = 60 * 13;
  this.freeList = 'freelist';
  this.expireList = 'xprl:';
  this.sessionList = 'ssnl:';
  this.client = redis.createClient(config.redis.port, config.redis.host);
};

RedisStore.prototype.push = function(session) {
  return Promise.all([
    this.client.hmsetAsync(this._sessionKey(session), session),
    this.client.rpushAsync(this.freeList, session.sessionId),
    this.client.setAsync(this._expiredKey(session), session.sessionId)
  ])
  .bind(this)
  .then(function() {
    this.client.expireAsync(this._expiredKey(session), this.SESSION_LIFETIME);
  });
};

RedisStore.prototype.pop = function() {
  return this.client.rpopAsync(this.freeList)
    .bind(this)
    .then(function(sessionId) {
      if (!sessionId) {
        throw new Error('No session available');
      }

      return this.isAlive(sessionId)
        .bind(this)
        .then(function() {
          return this.client.hgetallAsync(this._sessionKey(sessionId));
        })
        .catch(function() {
          return this.pop();
        });
    });
};

RedisStore.prototype.clean = function(deallocate, cursor) {
  return this.client.scanAsync(parseInt(cursor) || 0, 'MATCH', this.sessionList + '*')
    .bind(this)
    .spread(function(cursor, result) {
      _.each(result, function(sessionId) {
        sessionId = sessionId.split(':')[1];

        this.isAlive(sessionId)
          .bind(this)
          .catch(function() {
            this.getSessionById(sessionId)
              .bind(this)
              .then(deallocate)
              .catch()
              .finally(this.deleteSessionById.bind(this, sessionId));
          });
      }, this);

      if (parseInt(cursor)) {
        return this.clean(deallocate, cursor);
      }
    });
};

RedisStore.prototype.getSessionById = function(session) {
  return this.client.hgetallAsync(this._sessionKey(session));
};

RedisStore.prototype.deleteSessionById = function(session) {
  this.client.delAsync(this._sessionKey(session));
};

RedisStore.prototype.isAlive = function(session) {
  return this.client.getAsync(this._expiredKey(session))
    .bind(this)
    .then(function(alive) {
      if (!alive) {
        return Promise.reject(new Error('Stale session'));
      }

      return this.getSessionById(session);
    });
};

RedisStore.prototype._sessionKey = function(session) {
  if (session.sessionId) {
    return this.sessionList + session.sessionId;
  }

  return this.sessionList + session;
};

RedisStore.prototype._expiredKey = function(session) {
  if (session.sessionId) {
    return this.expireList + session.sessionId;
  }

  return this.expireList + session;
};


module.exports = RedisStore;