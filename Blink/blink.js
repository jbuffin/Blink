'use strict';
var sockets = require('./sockets');
var config = require('../config');
var Blink = function BlinkConstructor() {
  if (config.redis) {
    this.emitter = require('socket.io-emitter')(config.redis);
  }
};
Blink.prototype.listen = function listen(Server) {
  sockets(Server);
};

module.exports = new Blink();
