'use strict';
var config = require('../config');
var Socket = require('./socket');

var Blink = function BlinkConstructor() {
  if (config.redis) {
    this.emitter = require('socket.io-emitter')(config.redis);
  }
  this.sockets = [];
};

Blink.prototype.listen = function listen(Server) {
  this.io = require('socket.io')(Server);
  if(config.redis) {
    this.io.adapter(require('socket.io-redis')(config.redis));
  }
  this.io.on('connection', this.newSocket.bind(this));

  return this;
};

Blink.prototype.newSocket = function newSocket(socket) {
  var newSocket = new Socket(socket);
  var index = this.sockets.push(newSocket)-1;
  newSocket.on('disconnect', function() {
    this.sockets.splice(index, 1);
  }.bind(this));
};

module.exports = new Blink();
