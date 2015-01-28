var promise = require('radiodan-client').utils.promise,
    google  = require('googleapis'),
    gcal    = google.calendar('v3');

module.exports.create = function(oauth2Client) {
  var instance = {};

  instance.calendarList = function() {
    var dfd = promise.defer();

    gcal.calendarList.list(
      {auth: oauth2Client},
      function(err, calendars) {
        if(err) {
          dfd.reject(err);
        } else {
          dfd.resolve(calendars);
        }
      }
    );

    return dfd.promise;
  };

  instance.eventList = function(calendarId) {
    var dfd = promise.defer();

    gcal.events.list(
      {calendarId: calendarId, auth: oauth2Client},
      function(err, events) {
        if(err) {
          dfd.reject(err);
        } else {
          dfd.resolve(events);
        }
      }
    );

    return dfd.promise;
  };

  return instance;
};
