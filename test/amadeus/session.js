var Session = require('../../lib/amadeus/session/session');
var SessionPool = require('../../lib/amadeus/session/pool');
var RedisStore = require('../../lib/amadeus/session/store/redis');
var _ = require('lodash');
var later = require('later');

describe('Amadeus Session', function() {
  it.skip('should create new session', function(done) {
    var session = new Session('1', '1', '5I5O');
    var sessionTwo = new Session({
      sessionId: '1',
      sequenceNumber: '1',
      securityToken: '5I5O'
    });

    _.each([session, sessionTwo], function(session) {
      session.sessionId.should.be.eql('1');
      session.sequenceNumber.should.be.eql(1);
      session.securityToken.should.be.eql('5I5O');
    });
    
    done();
  });

  it.skip('should aquire new session', function(done) {
    var pool = new SessionPool();
    pool.aquire()
      .then(function(session) {
        session.sessionId.should.be.ok;
        session.securityToken.should.be.ok;
        done();
      });
  });

  it.skip('should clean up stale sessions', function(done) {
    this.timeout(60000*5);
    var pool = new SessionPool();
    later.setInterval(function() {
      pool.clean()
      .then(function() {
        done();
      });
    }, later.parse.recur().every(30).second());
  });
});