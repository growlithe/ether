var FlightSearch = require('../../model/flightsearch');
var request = require('../../lib/amadeus/request/fare_masterpricertravelboardsearch');
var logger = require('winston');

describe('Fare_MasterPricerTravelBoardSearch request', function() {
  it('should work', function(done) {
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

    var mock = {
      perform: function(name, payload) {
        logger.info(payload);
        payload.paxReference[0].ptc.should.eql('ADT');
        payload.paxReference[0].traveller[0].ref.should.eql(1);
        payload.paxReference[2].ptc.should.eql('INF');
        payload.paxReference[2].traveller[0].ref.should.eql(1);

        payload.itinerary[0].departureLocalization.departurePoint.locationId
          .should.be.eql(apiRequest.itinerary[0].from);

        payload.itinerary[0].arrivalLocalization.arrivalPointDetails.locationId
          .should.be.eql(apiRequest.itinerary[0].to);
        
        payload.itinerary[1].departureLocalization.departurePoint.locationId
          .should.be.eql(apiRequest.itinerary[1].from);

        payload.itinerary[1].arrivalLocalization.arrivalPointDetails.locationId
          .should.be.eql(apiRequest.itinerary[1].to);

        done();
      }
    };

    var search = FlightSearch.fromApi(apiRequest);

    request.bind(mock, search)();
  });
});