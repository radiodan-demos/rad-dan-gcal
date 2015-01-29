'use strict';

define(
  [
    'underscore', 'jquery', 'backbone'
  ],
  function(_, $, Backbone) {
    var SigninView = Backbone.View.extend({
      id: 'sign-in',
      render: function() {
        return this.$el.html(
          '<h1>Not signed in</h1>' +
          '<p>Please <a href="/api/signin">sign in to Google</a> ' +
          'to access your calendars.</p>'
        );
      }
    });

    return SigninView;
  }
);
