"use strict";

var express = require('express');
var router = express.Router();
var Amadeus = require('../lib/amadeus');
var FlightSearch = require('../model/flightsearch');

/* GET home page. */
router.post('/air/search', function(req, res) {
  var search = FlightSearch.fromApi(req.body);

  Amadeus.search(function(request) {
    return request.Fare_MasterPricerTravelBoardSearch(search)
      .then(function(response) {
        res.json(response.data);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

module.exports = router;
