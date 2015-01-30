var EventEmitter = require('events').EventEmitter,
    deepEqual = require('deep-equal'),
    radiodan = require('radiodan-client').create();

module.exports.create = function(bbcServices) {
  var instance = {},
      player   = radiodan.player.get('main'),
      stations = {},
      events   = [],
      priorEvent,
      intervalId;

  bbcServices.stations().then(function(bbcStations) {
    stations = bbcStations;
  });

  instance.events = new EventEmitter();

  instance.setEvents = function(newEvents) {
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

    if(deepEqual(priorEvent, matchedEvent)) {
      // same event as last time, don't worry about it
      console.log('No change to events');
      return;
    }

    // new event, and there's a station attached, play radio
    if(matchedEvent && station) {
      console.log('Now playing: ' + station.title);
      console.log('Until:', matchedEvent.end);

      player.load({playlist: station.playlist})
        .then(function() {
          return player.play();
        });

      instance.events.emit('update', {stationId: station.id});
    } else {
      // there was an event, now there's nothing. stop playing.
      console.log('Stop playing');
      player.clear();

      instance.events.emit('update', {stationId: false});
    }

    priorEvent = matchedEvent;
  }
};
