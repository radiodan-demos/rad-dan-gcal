'use strict';

define(
  [
    'underscore', 'jquery', 'backbone'
  ],
  function(_, $, Backbone) {
    var CalendarCol = Backbone.Collection.extend({
      url: '/api/calendars'
    });

    return CalendarCol;
  }
);
