var http = require('q-io/http'),
    Q    = require('q'),
    bbcServicesURL = 'http://bbc.services.radiodan.net';

module.exports = { create: create };

function create() {
  var instance = {},
      stationsPromise = fetchStations();

  instance.stations = function() { return stationsPromise; };

  return instance;
}

function fetchStations() {
  return http.request(bbcServicesURL + '/services.json')
    .then(function(req) {
      return req.body.read();
    }).then(function(body) {
      return Q.resolve(JSON.parse(body));
    }).then(function(bbc) {
      var stations = {};

      bbc.services.forEach(function(bbc) {
        stations[bbc.id] = {
          id: bbc.id,
          title: bbc.title,
          logo: bbc.logos.active,
          playlist: bbc.playlist
        };
      });

      return Q.resolve(stations);
    }).then(null, console.log);
}
