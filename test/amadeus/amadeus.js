var FlightSearch = require('../../model/flightsearch');
var Amadeus = require('../../lib/amadeus');
var Request = require('../../lib/amadeus/request');
var logger = require('winston');

describe('Amadeus module', function() {
  it.skip('should work', function(done) {
    this.timeout(15000);

    var apiRequest = {
      "itinerary": [
        {
          "from": "msq",
          "to": "lon",
          "date": "120715"
        },
        {
          "from": "lon",
          "to": "msq",
          "date": "220715"
        }
      ],
      "passenger": {
        "adult": 3,
        "child": 1,
        "infant": 2
      }
    };

    var search = FlightSearch.fromApi(apiRequest);

    Amadeus.search(function(request) {
      request.Fare_MasterPricerTravelBoardSearch(search)
        .then(function(response) {
          console.log(response.data);
          done();
        }, done);
    });

  });

  it.skip('security_authenticate request', function(done) {
    this.timeout(10000);

    request = new Request();
    request.Security_Authenticate()
      .then(function(response) {
        response.isSuccessful().should.be.true;
        done();
      })
      .catch(done);
  });
});