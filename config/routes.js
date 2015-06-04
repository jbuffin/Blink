'use strict';
var Controllers = require('../App/Controllers');
var routes = {
  init: function routesInit(app, emitter) {
    app.get('/', Controllers.RootController.getHomePage);

    app.post('/events', function(req, res) {
      Controllers.EventsController.handleIncomingEvent(req, res, emitter);
    });
  }
}
module.exports = routes;
