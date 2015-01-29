'use strict';

require.config({
  paths: {
    text: 'lib/text',
    underscore: 'lib/lodash.min',
    jquery: 'lib/jquery.min',
    backbone: 'lib/backbone.min',
  }
});

require(
  ['jquery', 'backbone', 'app/router'],
  function($, Backbone, AppRouter) {
    $(function() {
      // initialize App
      var router = new AppRouter();
      Backbone.history.start({pushState: true});
      console.log('ready');
    });
});
