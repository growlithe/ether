"use strict";

var _ = require('lodash');

var handler = function(flightSearch) {
  var name = 'Fare_MasterPricerTravelBoardSearch';

  var adults = [];
  var childs = [];
  var infants = [];

  adults.push({
    ptc: 'ADT',
    traveller: []
  });

  for (var n = 0; n < flightSearch.passengers.adult; n++) {
    adults[0].traveller.push({ ref: n + 1 });
  }

  if (flightSearch.passengers.child) {
    childs.push({
      ptc: 'CH',
      traveller: []
    });

    for (var j = 0; j < flightSearch.passengers.child; j++) {
      childs[0].traveller.push({ ref: j + 1 + flightSearch.passengers.adult });
    }
  }

  if (flightSearch.passengers.infant) {
    infants.push({
      ptc: 'INF',
      traveller: []
    });

    for (var k = 0; k < flightSearch.passengers.infant; k++) {
      infants[0].traveller.push({ ref: k + 1, infantIndicator: 1 });
    }    
  }

  var itineraries = _.map(flightSearch.itineraries, function(itinerary, n) {
    return {
      requestedSegmentRef: {
        segRef: n + 1
      },
      departureLocalization: {
        departurePoint: {
          locationId: itinerary.from.iataCode
        }
      },
      arrivalLocalization: {
        arrivalPointDetails: {
          locationId: itinerary.to.iataCode
        }
      },
      timeDetails: {
        firstDateTimeDetail: {
          date: itinerary.date.format('DDMMYY')
        }
      }
    };
  });

  var payload = {
    numberOfUnit: {
      unitNumberDetail: [
        {
          numberOfUnits: flightSearch.passengers.adult + flightSearch.passengers.child,
          typeOfUnit: 'PX'
        },
        {
          numberOfUnits: 200,
          typeOfUnit: 'RC'
        }
      ]
    },
    paxReference: adults.concat(childs, infants),
    fareOptions: {
      pricingTickInfo: {
        pricingTicketing: {
          priceType: [
            'ET',
            'RP',
            'RU',
            'NSD',
            'TAC'
          ]
        }
      }
    },

    itinerary: itineraries
  };

  return this.perform(name, payload);
};

module.exports = handler;