'use strict';

define(
  [
    'underscore', 'jquery', 'backbone',
    'app/collection/events',
    'app/collection/stations',
    'text!app/template/dashboard.html',
    'text!app/template/events.html',
    'text!app/template/playing.html'
  ],
  function(_, $, Backbone, EventsCollection, StationsCollection, DashboardTemplate, EventsTemplate, PlayingTemplate) {
    var DashboardView = Backbone.View.extend({
      id: 'dashboard',
      eventsTemplate: _.template(EventsTemplate),
      playingTemplate: _.template(PlayingTemplate),
      initialize: function() {
        // setup templates, view layout
        this.$el.html(DashboardTemplate);
        this.$events = this.$el.find('#events-list');
        this.$playing = this.$el.find('#playing');

        // create collections of models
        this.collection = new EventsCollection();
        this.stations = new StationsCollection();

        // bind updates to render
        this.collection.on('add remove update', function() {
          this.updateEventCollection();
        }, this);

        // set empty content in views
        this.updateEventCollection();
        this.updatePlaying();

        // fetch data
        this.collection.fetch();
        this.stations.fetch();

        // bind to eventsource
        this.bindToEvents(new EventSource('/events'));
      },
      render: function() {
        return this.$el;
      },
      updateEventCollection: function() {
        var txt = this.eventsTemplate({ events: this.collection.models });
        this.$events.html(txt);
      },
      updatePlaying: function(stationId) {
        var station = this.stations.get(stationId),
            txt     = this.playingTemplate({ station: station });

        this.$playing.html(txt);
      },
      bindToEvents: function(eventSource) {
        var self = this;

        eventSource.addEventListener('msg', function(e) {
          var data = JSON.parse(e.data);

          self.updatePlaying(data.stationId);
        });
      }
    });

    return DashboardView;
  }
);
