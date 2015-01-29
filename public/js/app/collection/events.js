'use strict';

define(
  [
    'underscore', 'jquery', 'backbone'
  ],
  function(_, $, Backbone) {
    var EventsCol = Backbone.Collection.extend({
      url: '/api/user/events'
    });

    return EventsCol;
  }
);
