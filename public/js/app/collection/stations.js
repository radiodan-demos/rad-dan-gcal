'use strict';

define(
  [
    'underscore', 'jquery', 'backbone'
  ],
  function(_, $, Backbone) {
    var StationsCol = Backbone.Collection.extend({
      url: '/api/stations'
    });

    return StationsCol;
  }
);
