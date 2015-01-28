'use strict';

require.config({
  paths: {
    text: 'lib/text',
    underscore: 'lib/lodash.min',
    jquery: 'lib/jquery.min',
    backbone: 'lib/backbone.min',
  }
});

require(['jquery', 'backbone'], function($, Backbone) {
  $(function() {
    // initialize App
    //new AppController($('#nav'), $('#content'));

    Backbone.history.start({pushState: true});
    console.log('lol');
  });
});
