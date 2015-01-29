'use strict';

define(
  [
    'underscore', 'jquery', 'backbone'
  ],
  function(_, $, Backbone) {
    var UserModel = Backbone.Model.extend({
      url: '/api/user',
      validate: function(attributes) {
        if(attributes.auth != true) {
          return "Not authenticated";
        }
      }
    });

    return UserModel;
  }
);
