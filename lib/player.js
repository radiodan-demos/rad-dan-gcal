var radiodan = require('radiodan-client').create(),
    bbcServices = require('./bbc-services').create();

module.exports.create = function() {
  var instance = {},
      player   = radiodan.player.get('main'),
      stations = {},
      events   = [],
      intervalId;

  bbcServices.stations().then(function(bbcStations) {
    stations = bbcStations;
  });

  instance.events = function(newEvents) {
    events = newEvents;

    stopInterval();

    intervalId = setInterval(determineEvents, 5000);
  }

  instance.stop = function() {
    stopInterval();

    return player.stop();
  }

  return instance;

  function stopInterval() {
    if(intervalId) {
      clearInterval(intervalId);
    }
  }

  function determineEvents() {
    var now = new Date(),
        matchedEvent = false,
        station,
        i;

    // find out if there is an active event
    for(i=0; i<events.length; i++) {
      var thisEvent = events[i];

      if(now < thisEvent.start) {
        //gone too far in event list, early exit
        break;
      }

      if(now > thisEvent.start && now < thisEvent.end) {
        matchedEvent = thisEvent;
        station = stations[thisEvent.name];
        break;
      }
    }

    // check status of player
    // TODO: match status to actual
    if(matchedEvent && station) {
      player.load({playlist: station.playlist})
        .then(function() {
          return player.play();
        });
    }
  }
};
