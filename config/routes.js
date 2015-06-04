'use strict';
var Controllers = require('../App/Controllers');
var routes = {
  init: function routesInit(app) {
    app.get('/', Controllers.RootController.getHomePage);
    app.post('/events', Controllers.EventsController.handleIncomingEvent);
  }
}
module.exports = routes;
