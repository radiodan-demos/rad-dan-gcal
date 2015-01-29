'use strict';

define(
  [
    'underscore', 'jquery', 'backbone',
    'app/collection/events',
    'text!app/template/dashboard.html'
  ],
  function(_, $, Backbone, EventsCollection, DashboardTemplate) {
    var DashboardView = Backbone.View.extend({
      id: 'dashboard',
      template: _.template(DashboardTemplate),
      initialize: function() {
        this.collection = new EventsCollection();
      },
      render: function() {
        var self = this;

        this.collection.fetch().then(
          function() {
            var txt = self.template({ events: self.collection.models });
            self.$el.html(txt);
          }, function(err) {
            console.log("ERR", err);
          }
        );

        return this.$el;
      }
    });

    return DashboardView;
  }
);
