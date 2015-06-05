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
    console.log('user disconnected');
    this.sockets.splice(index, 1);
  }.bind(this));
};

Blink.prototype.externalMessage = function externalMessage(data) {
  if(this.emitter) {
    this.emitter.to(data.room).emit('message', data);
    return true;
  } else {
    return false;
  }
};

module.exports = new Blink();
