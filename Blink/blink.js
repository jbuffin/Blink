'use strict';
var config = require('../config');
var Socket = require('./socket');

var Blink = function BlinkConstructor() {
  if (config.redis) {
    this.emitter = require('socket.io-emitter')(config.redis);
  }
};
Blink.prototype.listen = function listen(Server) {
  this.io = require('socket.io')(Server);
  if(config.redis) {
    this.io.adapter(require('socket.io-redis')(config.redis));
  }

  this.io.on('connection', function(socket) {
    new Socket(socket);
  });

  return this;
};

module.exports = new Blink();
