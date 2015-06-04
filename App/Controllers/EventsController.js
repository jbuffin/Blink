'use strict';
var Utils = require('../../utils');
var EventsController = function EventsControllerConstructor() {

};
EventsController.prototype.handleIncomingEvent = function handleIncomingEvent(req, res, emitter) {
  if(Utils.checkAuth(req.body.api_key)) {
    if(emitter) {
      emitter.to(req.body.room).emit('message', req.body);
      res.json(Utils.buildResponseJson(true));
    } else {
      res.json(Utils.buildResponseJson(false, 'Was not able to find redis'));
    }
  } else {
    res.json(Utils.buildResponseJson(false, 'Invalid API Key'));
  }
};

module.exports = new EventsController();
