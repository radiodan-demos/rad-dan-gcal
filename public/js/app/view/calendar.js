'use strict';

define(
  [
    'underscore', 'jquery', 'backbone',
    'app/collection/calendars',
    'text!app/template/calendars.html'
  ],
  function(_, $, Backbone, CalendarCollection, CalendarTemplate) {
    var CalendarView = Backbone.View.extend({
      id: 'calendar',
      template: _.template(CalendarTemplate),
      initialize: function() {
        this.calendars = new CalendarCollection();
      },
      render: function() {
        var self = this;

        this.calendars.fetch().then(
          function() {
            var txt = self.template({ calendars: self.calendars.models });
            self.$el.html(txt);
          }, console.log
        );

        return this.$el;
      }
    });

    return CalendarView;
  }
);
