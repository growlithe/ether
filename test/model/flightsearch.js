var FlightSearch = require('../../model/flightsearch');
var logger = require('winston');
var _ = require('lodash');

describe('Flight search models', function() {
  it('Should create FlightSearch model from valid request data', function(done) {
    var apiRequest = {
      "itinerary": [
        {
          "from": "msq",
          "to": "lon",
          "date": "120715"
        }
      ],
      "passenger": {
        "adult": 1
      }
    };

    var apiRequest2 = {
      "from": "msq",
      "to": "lon",
      "date": "120715",
      "adult": 1
    };

    var search = FlightSearch.fromApi(apiRequest);
    var search2 = FlightSearch.fromApi(apiRequest2);
    
    _.each([search, search2], function(search) {
      search.isValid().should.be.true;
      search.itineraries[0].from.iataCode.should.be.eql(apiRequest.itinerary[0].from);
      search.itineraries[0].to.iataCode.should.be.eql(apiRequest.itinerary[0].to);
      search.itineraries[0].date.format('DDMMYY').should.be.eql(apiRequest.itinerary[0].date);
      search.passengers.adult.should.be.eql(apiRequest.passenger.adult);
    });
    
    done();
  });

  it('Should indicate invalid state FlightSearch model with wrong data', function(done) {
    var apiRequest = {
      "itinerar0": [
        {
          "from": "msq",
          "to": "lon",
          "date": "120715"
        }
      ],
      "passenger": {
        "adult": "1"
      }
    };

    var search = FlightSearch.fromApi(apiRequest);
    
    search.isValid().should.be.false;

    done();
  });
});