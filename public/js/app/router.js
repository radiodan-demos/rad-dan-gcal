'use strict';

define(
  ['underscore', 'jquery', 'backbone',
  'app/model/user', 'app/view/signin', 'app/view/calendar'],
  function(_, $, Backbone, User, SigninView, CalendarView) {
    var AppRouter = Backbone.Router.extend({
      routes: {
        'app(/)': 'index',
        'app/signin(/)': 'signin',
        'app/calendars(/)': 'calendars',
        'app/dashboard': 'dashboard'
      },
      initialize: function() {
        this.user = new User();
        this.$content = $('#content');
      },
      index: function() {
        var self = this;
        // signed in?
        this.user.fetch().then(
          function() {
            if(self.user.isValid()) {
              self.navigate('app/dashboard', { trigger: true });
            } else {
              self.navigate('app/signin', { trigger: true });
            }
          }, console.log);
      },
      signin: function() {
        var self = this;
        // prompt to sign in
        this.user.fetch().then(
          function() {
            if(self.user.isValid()) {
              self.navigate('app/dashboard', { trigger: true });
            } else {
              var signin = new SigninView();
              self.$content.html(signin.render());
            }
          }, console.log);
      },
      calendars: function() {
        var self = this;
        // check for signin
        this.user.fetch().then(
          function() {
            if(self.user.isValid()) {
              var calendar = new CalendarView();
              self.$content.html(calendar.render());
            } else {
              self.navigate('/app/signin', { trigger: true });
            }
          }, console.log);
      },
      dashboard: function() {
        var self = this;
        // display dashboard
        this.user.fetch().then(
          function() {
            if(self.user.isValid()) {
              self.$content.html('<h1>Dashboard</h1>');
            } else {
              self.navigate('/app/signin', { trigger: true });
            }
          }, console.log);
      }
    });

    return AppRouter;
  }
);
