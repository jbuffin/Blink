'use strict';
var Utils = require('../../utils');
var Blink = require('../../Blink');
var EventsController = function EventsControllerConstructor() {

};

EventsController.prototype.handleIncomingEvent = function handleIncomingEvent(req, res) {
  var response,
      success = false;
  if(Utils.checkAuth(req.body.api_key)) {
    success = Blink.externalMessage(req.body);
    if(!success) {
      response = 'Was not able to process the message';
    }
  } else {
     response = 'Invalid API Key';
  }
  res.json(Utils.buildResponseJson(success, response));
};

module.exports = new EventsController();
